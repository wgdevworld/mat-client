/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Button, Image, ActivityIndicator} from 'react-native';
import {ShareMenuReactView} from 'react-native-share-menu';
// import store from '.././store/store';
// import {persistStore} from 'redux-persist';
// import {Provider, useDispatch} from 'react-redux';
// import {PersistGate} from 'redux-persist/integration/react';
// import {useAppDispatch} from '../store/hooks';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import colors from '../styles/colors';
import Config from 'react-native-config';
import {calculateDistance, trimCountry} from '../tools/CommonFunc';
import {Coordinate, MatZip} from '../types/store';
import axios from 'axios';
import {Text} from 'react-native';
import assets from '../../assets';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import {SHARED_STORAGE_ENUM} from '../types/sharedStorage';

const Share = () => {
  const googleSearchBarRef = useRef(null);
  const [searchedMatZip, setSearchedMatZip] = useState<MatZip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingLoading, setIsAddingLoading] = useState(false);

  const onPressSearchResult = async (data: any, details: any) => {
    setIsLoading(true);
    // pipeline for checking if this zip is already saved
    // here, we check our database if there is a zip with the same name.
    // if yes, we return this zip
    const searchKey =
      details.name.length > 2 ? details.name.substring(0, 2) : details.name;
    let isZipFoundInDB = false;
    try {
      const checkOurDBQuery = `{
        fetchZipByName(searchKey: "${searchKey}") {
          id
          name
          address
          reviewCount
          reviewAvgRating
          parentMap {
            name
          }
          category
          images {
            id
            src
          }
          latitude
          longitude
        }
      }`;
      const checkOurDBRes = await axios.post(
        'https://muckit-server.site/graphql',
        {
          query: checkOurDBQuery,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const checkOurDBData = checkOurDBRes?.data.data?.fetchZipByName;
      if (checkOurDBData && checkOurDBData.length > 0) {
        console.log('ℹ️ 저장된 맛집 찾음');
        checkOurDBData.forEach((zip: any) => {
          const distance = calculateDistance(
            {latitude: zip.latitude, longitude: zip.longitude},
            {
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            },
          );
          if (distance < 25) {
            if (isZipFoundInDB) {
              return;
            }
            console.log('🚀 해당 맛집이 있음');
            const location: Coordinate = {
              latitude: zip.latitude,
              longitude: zip.longitude,
            };
            const photoArray: string[] = zip.images.map(
              (photo: any) => photo.src,
            );
            const selectedMatZip: MatZip = {
              id: zip.id,
              name: zip.name,
              imageSrc: photoArray,
              coordinate: location,
              reviewAvgRating: zip.reviewAvgRating,
              reviewCount: zip.reviewCount,
              address: zip.address,
              category: zip.category,
            };
            setSearchedMatZip(selectedMatZip);
            isZipFoundInDB = true;
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
    if (isZipFoundInDB) {
      return;
    }
    //pipeline for checking if this zip is already saved in the database (by checking it against place_id)
    // if yes, we return this zip. if not, we create a new zip and return it.
    try {
      let fetchedZipData: any = null;
      const fetchZipQuery = `{
        fetchZipByGID(gid: "${data.place_id}") {
          id
          name
          address
          reviewCount
          reviewAvgRating
          parentMap {
            name
          }
          category
          images {
            id
            src
          }
          latitude
          longitude
        }
      }`;
      const fetchedZipRes = await axios.post(
        'https://muckit-server.site/graphql',
        {
          query: fetchZipQuery,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      fetchedZipData = fetchedZipRes?.data.data?.fetchZipByGID;
      if (!fetchedZipData) {
        const apiKey = Config.MAPS_API;
        let photoArray: string[] = [];
        if (!details.photos || details.photos.length === 0) {
          const defaultStreetViewImg = `https://maps.googleapis.com/maps/api/streetview?size=1200x1200&location=${details.geometry.location.lat},${details.geometry.location.lng}&key=${apiKey}`;
          photoArray = [defaultStreetViewImg];
        } else {
          details.photos.forEach((photo: any) => {
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${apiKey}`;
            photoArray.push(photoUrl);
          });
        }
        const variables = {
          zipInfo: {
            name: details.name,
            number: data.place_id,
            description: data.description,
            address: details.formatted_address,
            imgSrc: photoArray,
            category: data.types[0] ? data.types[0] : '식당',
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          },
        };
        const addZipMutation = `
          mutation addZip($zipInfo: CreateZipInput!) {
            addZip(zipInfo: $zipInfo) {
              id
              name
              address
              reviewCount
              reviewAvgRating
              category
              images {
                id
                src
              }
              latitude
              longitude
            }
        }`;
        const addZipRes = await axios.post(
          'https://muckit-server.site/graphql',
          {
            query: addZipMutation,
            variables: variables,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        fetchedZipData = addZipRes?.data.data.addZip;
      }
      const location = {
        latitude: fetchedZipData.latitude,
        longitude: fetchedZipData.longitude,
      };
      const photoArray: string[] = fetchedZipData.images.map(
        (photo: any) => photo.src,
      );
      const selectedMatZip: MatZip = {
        id: fetchedZipData.id,
        name: fetchedZipData.name,
        imageSrc: photoArray,
        coordinate: location,
        reviewAvgRating: fetchedZipData.reviewAvgRating,
        reviewCount: fetchedZipData.reviewCount,
        address: fetchedZipData.address,
        category: fetchedZipData.category,
      };
      console.log(selectedMatZip);
      setSearchedMatZip(selectedMatZip);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //@ts-ignore
    ShareMenuReactView.data()
      .then(data => {
        console.log(data);
        //@ts-ignore
        if (data.data[0].mimeType.startsWith('image')) {
          //handle image
          //@ts-ignore
        } else if (data.data[0].mimeType.startsWith('text')) {
          //@ts-ignore
          googleSearchBarRef.current.setAddressText(data.data[0].data);
        } else {
          //do nothing
        }
      })
      .catch(e => console.log(e));
  }, []);

  const handleAddToMap = async () => {
    setIsAddingLoading(true);
    try {
      const userMapId = await SharedGroupPreferences.getItem(
        SHARED_STORAGE_ENUM.USER_MAP_ID,
        'group.com.mat.muckit',
      );
      console.log(userMapId);
      const variables = {
        mapId: userMapId,
        zipId: searchedMatZip!.id,
      };
      const addToMapQuery = `
      mutation addToMap($mapId: String! $zipId:String!) {
        addToMap(mapId: $mapId zipId: $zipId) {
          id
          name
          address
          reviewCount
          reviewAvgRating
          category
          images {
            src
          }
          latitude
          longitude
        }
      }`;
      await axios.post(
        'https://muckit-server.site/graphql',
        {
          query: addToMapQuery,
          variables: variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      SharedGroupPreferences.setItem(
        SHARED_STORAGE_ENUM.LAST_UPDATED,
        new Date().toISOString(),
        'group.com.mat.muckit',
      );
    } catch (e) {
      console.log(e);
    } finally {
      setIsAddingLoading(false);
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        height: '50%',
        width: '100%',
        backgroundColor: colors.coral1,
        borderTopEndRadius: 12,
        borderTopLeftRadius: 12,
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 24,
            paddingBottom: 8,
          }}>
          <Button
            color={colors.white}
            title="닫기"
            onPress={async () => {
              ShareMenuReactView.dismissExtension();
            }}
          />
          {searchedMatZip ? (
            isAddingLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.white}
                style={{alignSelf: 'center'}}
              />
            ) : (
              <Button
                color={colors.white}
                title="내 맛맵에 추가하기"
                onPress={async () => {
                  await handleAddToMap();
                  ShareMenuReactView.dismissExtension();
                }}
              />
            )
          ) : null}
        </View>
        {isLoading || searchedMatZip ? (
          <View style={styles.itemContainer}>
            {searchedMatZip ? (
              <>
                <View style={styles.itemImageContainer}>
                  <Image
                    source={
                      searchedMatZip.imageSrc &&
                      searchedMatZip.imageSrc.length === 0
                        ? assets.images.placeholder
                        : {uri: searchedMatZip.imageSrc[0]}
                    }
                    style={styles.itemImage}
                  />
                </View>
                <View style={styles.itemInfoContainer}>
                  <View style={styles.itemTitleStarsContainer}>
                    <Text
                      style={styles.itemTitleText}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {searchedMatZip.name}
                    </Text>
                    <View style={styles.itemStarReviewContainer}>
                      {/* <Ionicons name="star" size={14} color={colors.coral1} /> */}
                      <Text style={styles.itemStarsText}>
                        {'★ ' + searchedMatZip.reviewAvgRating}
                      </Text>
                      <Text style={styles.itemReviewText}>
                        리뷰 {searchedMatZip.reviewCount}개
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={styles.itemSubtext}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {trimCountry(searchedMatZip.address)}
                  </Text>
                </View>
              </>
            ) : (
              <ActivityIndicator
                size="large"
                color={colors.coral1}
                style={{
                  alignSelf: 'center',
                  width: 76,
                  height: 76,
                  padding: 10,
                }}
              />
            )}
          </View>
        ) : (
          <View />
        )}
        {isLoading || searchedMatZip ? null : (
          <GooglePlacesAutocomplete
            minLength={1}
            GooglePlacesDetailsQuery={{
              fields: 'geometry,photos,name,formatted_address',
            }}
            debounce={0}
            placeholder="추가하고 싶은 맛집을 검색 후 선택해주세요!"
            textInputProps={{
              placeholderTextColor: 'black',
            }}
            // eslint-disable-next-line react/no-unstable-nested-components
            listEmptyComponent={() => {
              //@ts-ignore
              if (googleSearchBarRef.current?.getAddressText().length > 0) {
                return (
                  <View style={{flex: 1, padding: 12}}>
                    <Text>해당 맛집이 없어요! 😢</Text>
                  </View>
                );
              }
            }}
            query={{
              key: Config.MAPS_API,
              language: 'ko',
              // components: 'country:kr|country:us|country:pr',
              // rankby: 'distance',
              // types: 'restaurant|cafe|bakery|bar|liquor_store',
            }}
            numberOfLines={2}
            fetchDetails={true}
            onPress={async (data, details = null) => {
              await onPressSearchResult(data, details);
            }}
            isRowScrollable={false}
            onFail={error => console.error(error)}
            onNotFound={() => console.error('검색 결과 없음')}
            keepResultsAfterBlur={false}
            enablePoweredByContainer={false}
            styles={styles.searchTextInput}
            ref={googleSearchBarRef}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchTextInput: {
    position: 'absolute',
    listView: {
      borderRadius: 10,
      backgroundColor: 'white',
      maxHeight: '70%',
    },
    textInputContainer: {
      borderRadius: 10,
    },
    textInput: {
      backgroundColor: 'white',
      borderRadius: 10,
      color: 'black',
      borderColor: colors.coral1,
      borderWidth: 1,
    },
  },
  itemImageContainer: {
    width: 76,
    height: 76,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfoContainer: {
    flex: 1,
  },
  itemTitleText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    paddingBottom: 5,
    width: 150,
  },
  itemStarsText: {
    fontSize: 14,
    color: colors.coral1,
    paddingRight: 10,
    paddingLeft: 3,
  },
  itemReviewText: {
    fontSize: 14,
    color: colors.coral1,
  },
  itemTitleStarsContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemStarReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSubtext: {
    color: 'black',
    paddingVertical: 2,
    fontWeight: '200',
  },
  itemContainer: {
    justifyContent: 'center',

    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.grey,
    borderRadius: 10,
  },
});

export default Share;
