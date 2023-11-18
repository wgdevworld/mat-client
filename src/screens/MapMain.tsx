/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import 'react-native-gesture-handler';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import assets from '../../assets';
import colors from '../styles/colors';
import {requestPermissionAndGetLocation} from '../config/RequestRetrieveLocation';
import PlaceInfoMapCard from '../components/PlaceInfoMapCard';
import {
  addressToCoordinate,
  calculateDistance,
  ratingAverage,
  trimCountry,
} from '../tools/CommonFunc';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import {Coordinate, MatMap, MatZip} from '../types/store';
import {useAppSelector} from '../store/hooks';
import {useDispatch} from 'react-redux';
import {replaceOwnMatMapZipListAction} from '../store/modules/userMaps';
import DropDownPicker from 'react-native-dropdown-picker';
import {REQ_METHOD, request} from '../controls/RequestControl';
import Config from 'react-native-config';
import {updateLocationAndSendNoti} from '../controls/BackgroundTask';
import {throttle} from 'lodash';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function App(): JSX.Element {
  const dispatch = useDispatch();
  const userOwnMaps = useAppSelector(state => state.userMaps.ownMaps);
  const userFollowingMaps = useAppSelector(
    state => state.userMaps.followingMaps,
  );
  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const textInputRef = useRef(null);

  const [curMatMap, setCurMatMap] = useState<MatMap>(userOwnMaps[0]);
  const [buttonHeight, setButtonHeight] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [marker, setMarker] = useState<MatZip | null>();
  const [isSearchGoogle, setIsSearchGoogle] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedMatZips, setSearchedMatZips] =
    useState<{zipId: number; name: string; address: string}[]>();

  // States used for DropDownPicker
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [dropDownItems, setDropDownItems] = useState(
    userOwnMaps.map(item => ({
      label: item.name,
      value: item.id,
    })),
  );
  const [dropDownValue, setDropDownValue] = useState(dropDownItems[0].value);

  //TODO: 리덕스에다 저장
  const [currentLocation, setCurrentLocation] = useState<Coordinate>({
    latitude: 0,
    longitude: 0,
  });

  const allSavedZips: MatZip[] = userOwnMaps.flatMap(
    (allMaps: MatMap) => allMaps.zipList,
  );

  //TODO: think about if allSavedZips should be a dependency
  // for this useEffect. This may trigger the background task
  // to be run again if the user adds new MatZips.
  useEffect(() => {
    updateLocationAndSendNoti(allSavedZips);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    requestPermissionAndGetLocation(setCurrentLocation);
  }, []);

  useEffect(() => {
    setCurMatMap(userOwnMaps[0]);
  }, [userOwnMaps]);

  //TODO: 팔로잉 맵 목록 가져오기
  // const fetchFollowingMaps = async () => {
  //   try {
  //     const query = ` {
  //     fetchMapsFollowed {
  //       id
  //       name
  //     }
  //   }`;
  //     const res = await request(query, REQ_METHOD.QUERY);
  //     return res?.data.data.fetchMapsFollowed;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(async () => {
  //   const followingMaps = await fetchFollowingMaps();
  //   console.log(followingMaps);
  //   const maps = followingMaps.map((obj: any) => ({
  //     label: obj.name,
  //     value: obj.id,
  //   }));
  //   console.log(maps);
  //   setItems(maps);
  // }, []);

  useEffect(() => {
    const newRegion = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(newRegion, 1000);
  }, [currentLocation]);

  const performSearch = async (input: string) => {
    const query = `{
      fetchZipByName(searchKey: "${input}") {
        id
        name
        address
      }
    }`;
    const fetchedZipRes = await request(query, REQ_METHOD.QUERY);
    const fetchedZipData = fetchedZipRes?.data.data.fetchZipByName;
    return fetchedZipData;
  };

  const throttledSearch = useCallback(
    throttle(query => {
      performSearch(query)
        .then(data => {
          setSearchedMatZips(data);
        })
        .catch(error => {
          console.log(error);
        });
    }, 2000),
    [],
  );

  useEffect(() => {
    if (searchQuery.length > 0) {
      throttledSearch(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    console.log(searchedMatZips);
  }, [searchedMatZips]);

  const renderSearchedItem = item => {
    return (
      <TouchableOpacity
        onPress={() => {
          onPressSearchResult(item.item.id, item.item.address);
        }}
        style={styles.searchResultEntry}>
        <Text>{item.item.name}</Text>
      </TouchableOpacity>
    );
  };

  // useEffect(() => {
  //   if (searchQuery !== '') {
  //     searchMatDB();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchQuery]);

  const onPressSearchResult = async (data: any, details: any) => {
    let location: Coordinate;
    let fetchedZipData: any = null;
    if (typeof details === 'string') {
      location = await addressToCoordinate(details);
      const fetchZipQuery = `{
        fetchZip(id: "${data}") {
          id
          name
          address
          reviewCount
          reviewAvgRating
          parentMap {
            name
          }
          category
        }
      }`;
      const fetchedZipRes = await request(fetchZipQuery, REQ_METHOD.QUERY);
      fetchedZipData = fetchedZipRes?.data.data?.fetchZip;
    } else {
      location = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      };
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
        }
      }`;
      const fetchedZipRes = await request(fetchZipQuery, REQ_METHOD.QUERY);
      fetchedZipData = fetchedZipRes?.data.data?.fetchZipByGID;
    }
    //TODO: add functionality for custom Zips
    if (!fetchedZipData) {
      console.log('ℹ️ 맛집 생성중');
      const variables = {
        zipInfo: {
          name: details.name,
          number: data.place_id,
          description: data.description,
          address: details.formatted_address,
          imgSrc: [],
          category: data.types[0] ? data.types[0] : '식당',
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
          }
      }`;
      const addZipRes = await request(
        addZipMutation,
        REQ_METHOD.MUTATION,
        variables,
      );
      fetchedZipData = addZipRes?.data.data.addZip;
    }
    console.log(fetchedZipData);

    const fetchReviewQuery = `{
      fetchReviewsByZipId(zipId: "${fetchedZipData.id}") {
        writer {
          name
        }
        rating
        content
        createdAt
        images {
          id
          src
        }
      }
    }`;
    const fetchedReviewRes = await request(fetchReviewQuery, REQ_METHOD.QUERY);
    const fetchedReviewData = fetchedReviewRes?.data.data.fetchReviewsByZipId;

    const selectedMatZip: MatZip = {
      id: fetchedZipData.id,
      name: fetchedZipData.name,
      imageSrc: fetchedZipData.images
        ? fetchedZipData.images[0].src
        : assets.images.placeholder,
      coordinate: location,
      reviews: fetchedReviewData ? fetchedReviewData : [],
      reviewAvgRating: fetchedZipData.reviewAvgRating,
      reviewCount: fetchedZipData.reviewCount,
      address: fetchedZipData.address,
      category: fetchedZipData.category,
    };
    setMarker(selectedMatZip);
    mapRef.current?.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000,
    );
  };

  const snapPoints = useMemo(() => ['30%', '80%'], []);

  const handleSheetChange = useCallback(
    (index: any) => {
      const screenPercent = parseFloat(snapPoints[index]);
      setButtonHeight(screenHeight * screenPercent * 0.01);
      index === 0 && setButtonVisible(true);
    },
    [snapPoints],
  );

  const findAndSetCurMatMapByID = (givenId: string) => {
    const newMatMap = [...userOwnMaps, ...userFollowingMaps].find(
      item => item.id === givenId,
    );
    newMatMap && setCurMatMap(newMatMap);
  };

  const onPressAddBtn = async () => {
    try {
      const variables = {
        mapId: curMatMap.id,
        zipId: marker?.id,
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
      }
    }`;
      const addToMapRes = await request(
        addToMapQuery,
        REQ_METHOD.MUTATION,
        variables,
      );
      const addToMapDataArr = addToMapRes?.data.data.addToMap;
      const serializedZipList: MatZip[] = await Promise.all(
        addToMapDataArr.map(async (zip: any) => {
          let imgSrcArr = [];
          if (zip.images !== null) {
            imgSrcArr = zip.images.map((img: any) => img.src);
          } else {
            imgSrcArr = [];
          }
          let coordinate: Coordinate;
          try {
            coordinate = await addressToCoordinate(zip.address);
          } catch (error) {
            console.error(
              `Failed to get coordinates for address: ${zip.address}`,
              error,
            );
            coordinate = {latitude: 0, longitude: 0};
          }

          return {
            id: zip.id,
            name: zip.name,
            imageSrc: imgSrcArr,
            coordinate,
            address: zip.address,
            reviewCount: zip.reviewCount,
            reviewAvgRating: zip.reviewAvgRating,
            category: zip.category,
          } as MatZip;
        }),
      );
      dispatch(replaceOwnMatMapZipListAction(serializedZipList));
    } catch (e) {
      console.log(e);
    }
  };

  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();

  const renderItem = (matZip: MatZip) => {
    return (
      <TouchableOpacity
        key={matZip.id}
        style={styles.itemContainer}
        onPress={() => navigation.navigate('MatZipMain', {zipID: matZip.id})}>
        <View style={styles.itemImageContainer}>
          <Image
            source={
              matZip.imageSrc && matZip.imageSrc.length === 0
                ? assets.images.placeholder
                : {uri: matZip.imageSrc[0]}
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
              {matZip.name}
            </Text>
            {matZip.isVisited && (
              <Ionicons
                name="checkmark-done-circle-outline"
                size={20}
                color={colors.coral1}
              />
            )}
            <View style={styles.itemStarReviewContainer}>
              <Ionicons name="star" size={14} color={colors.coral1} />
              <Text style={styles.itemStarsText}>
                {ratingAverage(matZip.reviews)}
              </Text>
              <Text style={styles.itemReviewText}>
                리뷰 {matZip.reviews ? matZip.reviews.length : 0}개
              </Text>
            </View>
          </View>
          <Text
            style={styles.itemSubtext}
            numberOfLines={1}
            ellipsizeMode="tail">
            {trimCountry(matZip.address)}
          </Text>
          <Text style={styles.itemSubtext}>
            나와의 거리 {calculateDistance(matZip.coordinate, currentLocation)}m
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <View style={styles.searchTextInputContainer}>
          {isSearchGoogle ? (
            <GooglePlacesAutocomplete
              minLength={2}
              placeholder="구글 지도에서 장소를 검색해보세요!"
              textInputProps={{
                placeholderTextColor: 'black',
              }}
              query={{
                key: Config.MAPS_API,
                language: 'ko',
                components: 'country:kr',
              }}
              keyboardShouldPersistTaps={'handled'}
              fetchDetails={true}
              onPress={(data, details = null) => {
                setIsSearchGoogle(false);
                onPressSearchResult(data, details);
              }}
              onFail={error => console.error(error)}
              onNotFound={() => console.error('검색 결과 없음')}
              keepResultsAfterBlur={true}
              enablePoweredByContainer={false}
              styles={styles.searchTextInput}
            />
          ) : (
            <>
              <TextInput
                style={styles.ourDBSearchBar}
                ref={textInputRef}
                value={searchQuery}
                placeholderTextColor={'black'}
                placeholder="장소를 검색해보세요!"
                onChangeText={newText => setSearchQuery(newText)}
                onPressOut={() => {
                  setSearchQuery('');
                }}
              />
              {searchedMatZips && searchQuery.length !== 0 && (
                <FlatList
                  data={searchedMatZips}
                  renderItem={renderSearchedItem}
                  contentContainerStyle={styles.searchResultContainer}
                  ListFooterComponent={
                    <TouchableOpacity
                      onPress={() => {
                        setIsSearchGoogle(true);
                      }}
                      style={styles.searchResultEntry}>
                      <Text>검색 결과가 없으세요?</Text>
                    </TouchableOpacity>
                  }
                />
              )}
            </>
          )}
        </View>
        <View style={styles.container}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: currentLocation ? currentLocation.latitude : 37.5571888,
              longitude: currentLocation
                ? currentLocation.longitude
                : 126.923643,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={() => {
              setIsSearchGoogle(false);
              setSearchQuery('');
              setSearchedMatZips([]);
              if (textInputRef.current) {
                //@ts-ignore
                textInputRef.current.blur();
              }
              setMarker(null);
            }}>
            {marker && (
              <Marker coordinate={marker.coordinate}>
                <View style={styles.markerContentContainer}>
                  <PlaceInfoMapCard marker={marker} />
                  <Ionicons name="location" size={35} color={colors.coral1} />
                </View>
              </Marker>
            )}

            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="현재 위치">
                <View style={styles.selfMarkerContainer}>
                  <Ionicons
                    name="radio-button-on-outline"
                    size={15}
                    color={colors.coral1}
                  />
                </View>
              </Marker>
            )}
          </MapView>
          {buttonVisible && (
            <TouchableOpacity
              style={{
                ...styles.mapBtn,
                bottom: buttonHeight,
              }}
              onPress={() => {
                requestPermissionAndGetLocation(setCurrentLocation);
              }}>
              <View style={{...styles.mapBtnContainer, marginBottom: 5}}>
                <Ionicons
                  name="navigate-outline"
                  color={'white'}
                  size={25}
                  style={{paddingRight: 2}}
                />
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              ...styles.mapBtn,
              bottom: buttonHeight + 50,
              display: marker ? 'flex' : 'none',
            }}
            onPress={onPressAddBtn}>
            <View style={styles.mapBtnContainer}>
              <Ionicons
                name="add-outline"
                color={'white'}
                size={35}
                style={{paddingLeft: 2}}
              />
            </View>
          </TouchableOpacity>
          <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            onChange={handleSheetChange}>
            <BottomSheetFlatList
              data={curMatMap.zipList}
              keyExtractor={i => i.id}
              renderItem={({item}) => renderItem(item)}
              contentContainerStyle={styles.contentContainer}
              onScrollBeginDrag={() => {
                setButtonVisible(false);
              }}
              ListHeaderComponent={
                <View style={styles.bottomSheetHeader}>
                  <Text
                    style={{
                      fontSize: 20,
                      alignSelf: 'center',
                      marginLeft: 16,
                      color: colors.coral1,
                    }}>
                    근처 나의 맛집들 📍
                  </Text>
                  <DropDownPicker
                    containerStyle={styles.dropDownPickerContainer}
                    placeholder="맛맵 선택"
                    open={dropDownOpen}
                    setOpen={setDropDownOpen}
                    value={dropDownValue}
                    setValue={setDropDownValue}
                    onChangeValue={item => {
                      item && findAndSetCurMatMapByID(item);
                    }}
                    items={dropDownItems}
                    setItems={setDropDownItems}
                    itemKey="value"
                  />
                </View>
              }
              stickyHeaderIndices={[0]}
              ListFooterComponent={<View style={{height: 200}} />}
            />
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapBottomSheetContainer: {
    flex: 1,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingBottom: 10,
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 60,
  },
  navBtnContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    zIndex: 1,
    height: 60,
    width: '100%',
    backgroundColor: 'white',
  },
  markerContentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selfMarkerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBtn: {
    width: screenWidth / 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTextInputContainer: {
    position: 'absolute',
    paddingTop: getStatusBarHeight(),
    zIndex: 1,
    width: '95%',
    alignSelf: 'center',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  searchTextInput: {
    position: 'absolute',
    textInputContainer: {
      borderRadius: 10,
    },
    textInput: {
      backgroundColor: 'white',
      borderRadius: 10,
      color: 'black',
    },
  },
  iconContainer: {
    paddingLeft: 10,
  },
  mapBtn: {
    zIndex: 2,
    position: 'absolute',
    right: '3%',
  },
  mapBtnContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.coral1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  flatListHeaderText: {
    color: colors.coral1,
    fontSize: 20,
    paddingLeft: 16,
    paddingBottom: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 12,
    marginVertical: 5,
    backgroundColor: colors.grey,
    borderRadius: 10,
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
  itemSubtext: {
    color: 'black',
    paddingVertical: 2,
    fontWeight: '200',
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
  dropDownPickerContainer: {
    width: '30%',
    alignSelf: 'center',
    marginRight: 16,
  },
  ourDBSearchBar: {
    height: 44,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 15,
    paddingLeft: 10,
    color: 'black',
    includeFontPadding: true,
  },
  searchResultContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 5,
  },
  searchResultEntry: {
    padding: 12,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.17,
    alignContent: 'center',
  },
});

export default App;
