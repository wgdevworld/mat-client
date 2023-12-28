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
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import assets from '../../assets';
import colors from '../styles/colors';
import {requestPermissionAndGetLocation} from '../config/RequestRetrieveLocation';
import PlaceInfoMapCard from '../components/PlaceInfoMapCard';
import {
  addressToCoordinate,
  calculateDistance,
  trimCountry,
} from '../tools/CommonFunc';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import {Coordinate, MatMap, MatZip} from '../types/store';
import {useAppSelector} from '../store/hooks';
import {useDispatch} from 'react-redux';
import {
  removeFromOwnMatMapAction,
  replaceOwnMatMapZipListAction,
} from '../store/modules/userMaps';
import DropDownPicker from 'react-native-dropdown-picker';
import {REQ_METHOD, request} from '../controls/RequestControl';
import Config from 'react-native-config';
import {updateLocationAndSendNoti} from '../controls/BackgroundTask';
import {throttle} from 'lodash';
import SwipeableRow from '../components/SwipeableRow';
import {updateIsLoadingAction} from '../store/modules/globalComponent';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

function App(): JSX.Element {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const userOwnMaps = useAppSelector(state => state.userMaps.ownMaps);
  const userFollowingMaps = useAppSelector(
    state => state.userMaps.followingMaps,
  );
  const curUser = useAppSelector(state => state.user);
  const visitedZips = useAppSelector(state => state.visitedZips.visitedZips);

  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const textInputRef = useRef(null);

  const [curMatMap, setCurMatMap] = useState<MatMap>(userOwnMaps[0]);
  const [marker, setMarker] = useState<MatZip | null>();
  const [isSearchGoogle, setIsSearchGoogle] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMarkerSavedMatZip, setIsMarkerSavedMatZip] = useState(false);
  const [searchedMatZips, setSearchedMatZips] =
    useState<{zipId: number; name: string; address: string}[]>();
  const [orderedMatZips, setOrderedMatZips] = useState<MatZip[]>(
    curMatMap.zipList,
  );

  // States used for DropDownPicker
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [dropDownItems, setDropDownItems] = useState([
    ...userOwnMaps.map(item => ({
      label: item.name,
      value: item.id,
    })),
    ...userFollowingMaps.map(item => ({
      label: item.name,
      value: item.id,
    })),
  ]);

  useEffect(() => {
    setDropDownItems([
      ...userOwnMaps.map(item => ({
        label: item.name,
        value: item.id,
      })),
      ...userFollowingMaps.map(item => ({
        label: item.name,
        value: item.id,
      })),
    ]);
  }, [userOwnMaps, userFollowingMaps]);

  const [dropDownValue, setDropDownValue] = useState(dropDownItems[0].value);

  const [currentLocation, setCurrentLocation] = useState<Coordinate>({
    latitude: 0,
    longitude: 0,
  });

  //TODO: add following maps as well
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

  // useEffect(() => {
  //   requestPermissionAndGetLocation(setCurrentLocation);
  // }, []);

  useEffect(() => {
    setCurMatMap(userOwnMaps[0]);
  }, [userOwnMaps]);

  useEffect(() => {
    setOrderedMatZips(curMatMap.zipList);
  }, [curMatMap]);

  useEffect(() => {
    setOrderedMatZips(prev => {
      const sortedArray = [...prev].sort(
        (a, b) =>
          calculateDistance(a.coordinate, currentLocation) -
          calculateDistance(b.coordinate, currentLocation),
      );

      return sortedArray;
    });
  }, [currentLocation, curMatMap, visitedZips]);

  useEffect(() => {
    const newRegion = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(newRegion, 300);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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

  const onPressSearchResult = async (data: any, details: any) => {
    dispatch(updateIsLoadingAction(true));
    try {
      setSearchQuery('');
      let fetchedZipData: any = null;
      // if searched with our DB
      if (typeof details === 'string') {
        // location = await addressToCoordinate(details);
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
          images {
            id
            src
          }
          latitude
          longitude
        }
      }`;
        const fetchedZipRes = await request(fetchZipQuery, REQ_METHOD.QUERY);
        fetchedZipData = fetchedZipRes?.data.data?.fetchZip;
      } else {
        // if searched with Google Maps API
        // location = {
        //   latitude: details.geometry.location.lat,
        //   longitude: details.geometry.location.lng,
        // };
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
        const fetchedZipRes = await request(fetchZipQuery, REQ_METHOD.QUERY);
        fetchedZipData = fetchedZipRes?.data.data?.fetchZipByGID;
      }
      if (!fetchedZipData) {
        console.log('ℹ️ 맛집 생성중');
        const apiKey = Config.MAPS_API;
        const defaultStreetViewImg = `https://maps.googleapis.com/maps/api/streetview?size=1200x1200&location=${details.geometry.location.lat},${details.geometry.location.lng}&key=${apiKey}`;
        const variables = {
          zipInfo: {
            name: details.name,
            number: data.place_id,
            description: data.description,
            address: details.formatted_address,
            imgSrc: [defaultStreetViewImg],
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
        const addZipRes = await request(
          addZipMutation,
          REQ_METHOD.MUTATION,
          variables,
        );
        fetchedZipData = addZipRes?.data.data.addZip;
      }

      let defaultStreetViewImg = assets.images.placeholder;
      if (
        fetchedZipData.images === undefined ||
        fetchedZipData.images.length === 0
      ) {
        console.log('⛔️ no image');
        const apiKey = Config.MAPS_API;
        //@ts-ignore
        defaultStreetViewImg = `https://maps.googleapis.com/maps/api/streetview?size=1200x1200&location=${fetchedZipData.latitude},${fetchedZipData.longitude}&key=${apiKey}`;
        const updateZipQuery = `
          mutation updateZip($id: String!, $zipInfo: UpdateZipInput!) {
              updateZip(id: $id, zipInfo: $zipInfo) {
                id
              }
          }
         `;
        const updateZipVariables = {
          id: fetchedZipData.id,
          zipInfo: {
            imgSrc: [defaultStreetViewImg],
          },
        };
        await request(updateZipQuery, REQ_METHOD.MUTATION, updateZipVariables);
      }
      // fallback if matzip has no coordinates
      let location: Coordinate;
      if (
        fetchedZipData.latitude === null ||
        fetchedZipData.longitude === null
      ) {
        console.log('⛔️ no coordinate');
        if (typeof details === 'string') {
          location = await addressToCoordinate(details);
        } else {
          location = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
          };
        }
        const updateZipQuery = `
          mutation updateZip($id: String!, $zipInfo: UpdateZipInput!) {
              updateZip(id: $id, zipInfo: $zipInfo) {
                id
                latitude
                longitude
              }
          }
         `;
        const updateZipVariables = {
          id: fetchedZipData.id,
          zipInfo: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        };
        await request(updateZipQuery, REQ_METHOD.MUTATION, updateZipVariables);
      } else {
        location = {
          latitude: fetchedZipData.latitude,
          longitude: fetchedZipData.longitude,
        };
      }

      //   const fetchReviewQuery = `{
      //   fetchReviewsByZipId(zipId: "${fetchedZipData.id}") {
      //     writer {
      //       name
      //     }
      //     rating
      //     content
      //     createdAt
      //     images {
      //       id
      //       src
      //     }
      //   }
      // }`;
      //   const fetchedReviewRes = await request(
      //     fetchReviewQuery,
      //     REQ_METHOD.QUERY,
      //   );
      //   const fetchedReviewData = fetchedReviewRes?.data.data.fetchReviewsByZipId;

      const selectedMatZip: MatZip = {
        id: fetchedZipData.id,
        name: fetchedZipData.name,
        imageSrc:
          fetchedZipData.images || fetchedZipData.images.length === 0
            ? defaultStreetViewImg
            : fetchedZipData.images[0].src,
        coordinate: location,
        reviewAvgRating: fetchedZipData.reviewAvgRating,
        reviewCount: fetchedZipData.reviewCount,
        address: fetchedZipData.address,
        category: fetchedZipData.category,
      };
      setMarker(selectedMatZip);
      setIsMarkerSavedMatZip(false);
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        0,
      );
      dispatch(updateIsLoadingAction(false));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(updateIsLoadingAction(false));
    }
  };

  const snapPoints = useMemo(() => ['30%', '80%'], []);

  const findAndSetCurMatMapByID = (givenId: string) => {
    const newMatMap = [...userOwnMaps, ...userFollowingMaps].find(
      item => item.id === givenId,
    );
    newMatMap && setCurMatMap(newMatMap);
    setMarker(null);
  };
  const onPressAddBtn = async () => {
    try {
      dispatch(updateIsLoadingAction(true));
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
        latitude
        longitude
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
          console.log(zip);
          if (zip.images) {
            imgSrcArr = zip.images.map((img: any) => img.src);
          } else {
            const apiKey = Config.MAPS_API;
            const defaultStreetViewImg = `https://maps.googleapis.com/maps/api/streetview?size=1200x1200&location=${zip.latitude},${zip.longitude}&key=${apiKey}`;
            imgSrcArr = [defaultStreetViewImg];
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
    } finally {
      dispatch(updateIsLoadingAction(false));
    }
  };

  const onDeleteMatZip = async (id: string) => {
    dispatch(updateIsLoadingAction(true));
    const removeFromMapQuery = `
      mutation removeFromMap($mapId: String! $zipId:String!) {
        removeFromMap(mapId: $mapId, zipId: $zipId) {
          id
        }
      }
      `;
    const variables = {
      mapId: curMatMap.id,
      zipId: id,
    };
    await request(removeFromMapQuery, REQ_METHOD.MUTATION, variables);
    dispatch(removeFromOwnMatMapAction(id));
    dispatch(updateIsLoadingAction(false));
  };

  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();

  const renderItem = (matZip: MatZip) => {
    return (
      <SwipeableRow
        onSwipeableRightOpen={() => {
          onDeleteMatZip(matZip.id);
        }}>
        <TouchableOpacity
          key={matZip.id}
          style={styles.itemContainer}
          onPress={() => {
            navigation.navigate('MatZipMain', {zipID: matZip.id});
          }}>
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
              <View style={styles.itemStarReviewContainer}>
                <Ionicons name="star" size={14} color={colors.coral1} />
                <Text style={styles.itemStarsText}>
                  {matZip.reviewAvgRating}
                </Text>
                <Text style={styles.itemReviewText}>
                  리뷰 {matZip.reviewCount}개
                </Text>
              </View>
            </View>
            <Text
              style={styles.itemSubtext}
              numberOfLines={1}
              ellipsizeMode="tail">
              {trimCountry(matZip.address)}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.itemSubtext}>
                나와의 거리{' '}
                {calculateDistance(matZip.coordinate, currentLocation)}m
              </Text>
              {visitedZips.find(zip => zip.id === matZip.id) && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.coral1}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </SwipeableRow>
    );
  };

  return (
    <View style={{flex: 1}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <View
          style={{...styles.searchTextInputContainer, paddingTop: insets.top}}>
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
              <View style={{flexDirection: 'row'}}>
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
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={{position: 'absolute', right: 5, top: 9}}
                    onPress={() => {
                      setSearchQuery('');
                      setSearchedMatZips([]);
                      if (textInputRef.current) {
                        //@ts-ignore
                        textInputRef.current.blur();
                      }
                    }}>
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color={colors.coral1}
                    />
                  </TouchableOpacity>
                )}
              </View>
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
              // TODO: figure out when to make marker null
            }}>
            {marker && (
              <>
                <Marker
                  key={`key_${marker.coordinate.latitude}_${marker.coordinate.longitude}`}
                  onPress={() => {
                    dispatch(updateIsLoadingAction(true));
                    navigation.navigate('MatZipMain', {
                      zipID: marker?.id,
                    });
                  }}
                  coordinate={marker.coordinate}>
                  <View style={styles.markerContentContainer}>
                    <PlaceInfoMapCard marker={marker} />
                    <Ionicons name="location" size={26} color={colors.coral1} />
                  </View>
                </Marker>
              </>
            )}

            {curMatMap &&
              curMatMap.zipList.map(zip => {
                return (
                  <Marker
                    key={zip.id}
                    coordinate={zip.coordinate}
                    id={zip.id}
                    onPress={() => {
                      setMarker(zip);
                      setIsMarkerSavedMatZip(true);
                    }}>
                    <View style={styles.markerContentContainer}>
                      <Ionicons
                        name="location"
                        size={26}
                        color={colors.coral1}
                      />
                    </View>
                  </Marker>
                );
              })}

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
          <TouchableOpacity
            style={styles.mapBtn}
            onPress={() => {
              requestPermissionAndGetLocation(setCurrentLocation);
            }}>
            <View
              style={{
                ...styles.mapBtnContainer,
                marginBottom: 5,
                top: insets.top + 55,
              }}>
              <Ionicons
                name="navigate-outline"
                color={'white'}
                size={22}
                style={{paddingRight: 2}}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.mapBtn,
              display:
                marker &&
                !isMarkerSavedMatZip &&
                curMatMap.authorId === curUser.id
                  ? 'flex'
                  : 'none',
            }}
            onPress={onPressAddBtn}>
            <View
              style={{
                ...styles.mapBtnContainer,
                top: insets.top + 100,
              }}>
              <Ionicons
                name="add-outline"
                color={'white'}
                size={22}
                style={{paddingLeft: 2}}
              />
            </View>
          </TouchableOpacity>

          <BottomSheet ref={sheetRef} snapPoints={snapPoints}>
            {orderedMatZips && orderedMatZips.length !== 0 ? (
              <BottomSheetFlatList
                data={orderedMatZips}
                keyExtractor={i => i.id}
                renderItem={({item}) => renderItem(item)}
                contentContainerStyle={styles.contentContainer}
                // onScrollEndDrag={() => {
                //   setButtonVisible(true);
                // }}
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
                extraData={currentLocation}
              />
            ) : (
              <>
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
                    dropDownContainerStyle={{height: 150}}
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
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    justifyContent: 'center',
                    paddingTop: 10,
                  }}>
                  <Ionicons
                    name="information-circle-outline"
                    size={26}
                    color={colors.coral1}
                    style={{alignSelf: 'center'}}
                  />
                  <Text
                    style={{
                      fontSize: 12.5,
                      alignSelf: 'center',
                      color: colors.coral1,
                      paddingLeft: 3,
                    }}>
                    {'저장하고 싶은 맛집을 \n검색해서 추가하세요!'}
                  </Text>
                </View>
              </>
            )}
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
    position: 'absolute',
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    right: 10,
    width: 35,
    height: 35,
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
    width: '28%',
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
