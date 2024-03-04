/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
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
  removeFollowingMatMapAction,
  removeFromOwnMatMapAction,
  replaceOwnMatMapZipListAction,
  updateOwnMapImgAction,
  updateOwnMapNameAction,
  updatePublicStatusAction,
} from '../store/modules/userMaps';
import DropDownPicker from 'react-native-dropdown-picker';
import {REQ_METHOD, request} from '../controls/RequestControl';
import Config from 'react-native-config';
// import {updateLocationAndSendNoti} from '../controls/BackgroundTask';
import {throttle} from 'lodash';
import SwipeableRow from '../components/SwipeableRow';
import {
  updateIsJustFollowed,
  updateIsLoadingAction,
} from '../store/modules/globalComponent';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Share from 'react-native-share';
import Geolocation from 'react-native-geolocation-service';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {v4 as uuidv4} from 'uuid';
import {removeUserFollower} from '../controls/MatMapControl';
import BackgroundGeolocation, {
  Subscription,
} from 'react-native-background-geolocation';
import {locationBackgroundTask} from '../controls/BackgroundTask';
import Bugsnag from '@bugsnag/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';

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
  const isRefuseNotifications = useAppSelector(
    state => state.globalComponents.isRefuseNotifications,
  );
  const isJustFollowed = useAppSelector(
    state => state.globalComponents.isJustFollowed,
  );

  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const textInputRef = useRef(null);

  const [curMatMap, setCurMatMap] = useState<MatMap>(userOwnMaps[0]);
  const [marker, setMarker] = useState<MatZip | null>();
  const [isSearchGoogle, setIsSearchGoogle] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchResultLoading, setIsSearchResultLoading] = useState(false);
  const [searchedMatZips, setSearchedMatZips] =
    useState<{zipId: number; name: string; address: string}[]>();
  const [orderedMatZips, setOrderedMatZips] = useState<MatZip[]>(
    curMatMap.zipList,
  );
  const [isEditPublicMapVisible, setIsEditPublicMapVisible] = useState(false);
  const [newPublicMapName, setNewPublicMapName] = useState(userOwnMaps[0].name);
  const [imgLibraryResponse, setImgLibraryResponse] =
    useState<ImagePickerResponse>();

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

  useEffect(() => {
    const onLocation: Subscription = BackgroundGeolocation.onLocation(
      async location => {
        if (location.sample === true) {
          console.log('- location is a sample');
          return;
        }
        if (location.coords === undefined) {
          return;
        }
        // eslint-disable-next-line eqeqeq
        if (location.activity.type == 'in_vehicle') {
          return;
        }
        console.log(location);
        const taskId = await BackgroundGeolocation.startBackgroundTask();
        try {
          await locationBackgroundTask(location);
          BackgroundGeolocation.stopBackgroundTask(taskId);
        } catch (e) {
          Bugsnag.notify(new Error(e as string));
          BackgroundGeolocation.stopBackgroundTask(taskId);
        }
      },
    );

    AsyncStorage.getItem(ASYNC_STORAGE_ENUM.NOTIFICATION_RADIUS).then(
      notiRadius => {
        BackgroundGeolocation.ready({
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_MEDIUM,
          stationaryRadius: notiRadius
            ? parseInt(notiRadius, 10) / 20
            : 2000 / 20,
          distanceFilter: notiRadius ? parseInt(notiRadius, 10) / 2 : 2000 / 2,
          // Activity Recognition
          stopTimeout: 5,
          // Application config
          debug: false,
          showsBackgroundLocationIndicator: false,
          stopOnTerminate: false,
          startOnBoot: true,
        }).then(_state => {
          console.log('BackgroundGeolocation is ready');
          if (!isRefuseNotifications) {
            BackgroundGeolocation.start();
          }
        });
      },
    );

    return () => {
      onLocation.remove();
    };
  }, []);

  useEffect(() => {
    requestPermissionAndGetLocation(setCurrentLocation, mapRef);
  }, []);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setCurrentLocation({latitude, longitude});
      },
      error => console.log(error),
      {enableHighAccuracy: true, distanceFilter: 10},
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

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
      setIsSearchResultLoading(true);
      performSearch(query)
        .then(data => {
          setSearchedMatZips(data);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          setIsSearchResultLoading(false);
        });
    }, 2000),
    [],
  );

  useEffect(() => {
    if (searchQuery.length > 1) {
      setIsSearchResultLoading(true);
      throttledSearch(searchQuery);
    }
  }, [searchQuery]);

  const renderSearchedItem = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onPressSearchResult(item.item.id, item.item.address);
        }}
        style={styles.searchResultEntry}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>{item.item.name}</Text>
          <Text
            style={{fontSize: 12, maxWidth: '70%', alignSelf: 'center'}}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.item.address}
          </Text>
        </View>
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

  const snapPoints = useMemo(() => ['3%', '30%', '80%'], []);

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
          if (zip.images) {
            imgSrcArr = zip.images.map((img: any) => img.src);
          } else {
            const apiKey = Config.MAPS_API;
            const defaultStreetViewImg = `https://maps.googleapis.com/maps/api/streetview?size=1200x1200&location=${zip.latitude},${zip.longitude}&key=${apiKey}`;
            imgSrcArr = [defaultStreetViewImg];
          }

          const coordinate = {
            latitude: zip.latitude,
            longitude: zip.longitude,
          };

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

  const onPressShareMatMap = async () => {
    const deepLinkUrl = `mucket-app://follow_map?id=${curMatMap.id}`;
    await Share.open({
      message:
        curMatMap.id === curUser.id
          ? `먹킷 어플에서 만든 제 맛맵을 팔로우 해보세요!
          \nMuckit 어플 미설치시 ${
            Platform.OS === 'ios' ? '앱 스토어' : '플레이 스토어'
          }에서 Muckit을 설치해주세요.`
          : `${curMatMap.author} 유저가 만든 ${
              curMatMap.name
            } 맛맵을 팔로우 해보세요!
            \nMuckit 어플 미설치시 ${
              Platform.OS === 'ios' ? '앱 스토어' : '플레이 스토어'
            }에서 Muckit을 설치해주세요.`,
      url: deepLinkUrl,
    })
      .then(res => console.log(res))
      .catch(e => console.log(e));
  };

  const onPublicStatusChange = async () => {
    dispatch(updateIsLoadingAction(true));
    try {
      const updateMapQuery = `
      mutation updateMap($mapInfo: UpdateMapInput!, $id: String!) {
        updateMap(mapInfo: $mapInfo, id: $id) {
          publicStatus
        }
      }
    `;
      const updateMapVariables = {
        mapInfo: {
          publicStatus: !curMatMap.publicStatus,
        },
        id: curMatMap.id,
      };
      const updateMapRes = await request(
        updateMapQuery,
        REQ_METHOD.MUTATION,
        updateMapVariables,
      );
      if (updateMapRes === null || updateMapRes === undefined) {
        return;
      }
      dispatch(
        updatePublicStatusAction(updateMapRes.data.data.updateMap.publicStatus),
      );
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(updateIsLoadingAction(false));
      if (curMatMap.publicStatus === false) {
        setIsEditPublicMapVisible(true);
      }
    }
  };

  const requestPublicMapChange = async () => {
    setIsEditPublicMapVisible(false);
    dispatch(updateIsLoadingAction(true));
    let mapPhoto;
    if (imgLibraryResponse) {
      const imgSrcString = await uploadImageToServer(imgLibraryResponse);
      const uploadImageString = imgSrcString.map(
        (item: string) => 'https://storage.googleapis.com/' + item,
      );
      mapPhoto = {
        imageSrc: uploadImageString[0],
      };
      setImgLibraryResponse(undefined);
    }

    //TODO: have a default map image if user doesn't pick
    const variables = {
      mapInfo: {
        name: newPublicMapName,
        ...(mapPhoto ? mapPhoto : ''),
      },
      id: userOwnMaps[0].id,
    };

    const query = `
    mutation updateMap($mapInfo: UpdateMapInput! $id: String!) {
      updateMap(mapInfo: $mapInfo id: $id) {
        id
      }
    }`;

    try {
      await request(query, REQ_METHOD.MUTATION, variables);
      dispatch(updateOwnMapImgAction(mapPhoto ? mapPhoto.imageSrc : ''));
      dispatch(updateOwnMapNameAction(newPublicMapName));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(updateIsLoadingAction(false));
    }
  };

  const onPressChoosePhoto = async () => {
    const options: ImageLibraryOptions = {
      maxWidth: 1280,
      maxHeight: 1280,
      mediaType: 'photo',
      selectionLimit: 1,
    };
    await launchImageLibrary(options, response => {
      if (!response.assets) {
        console.log(response.errorMessage);
      } else {
        setImgLibraryResponse(response);
      }
    });
  };

  const uploadImageToServer = async (response?: ImagePickerResponse) => {
    if (response?.assets?.length === 0) {
      return;
    }

    let formData = new FormData();

    const map: {[key: string]: string[]} = {};
    response?.assets?.forEach((asset, index) => {
      map[String(index)] = [`variables.files.${index}`];
    });

    formData.append(
      'operations',
      JSON.stringify({
        query: `
            mutation ($files: [Upload!]!) {
                upload(files: $files)
            }
        `,
        variables: {
          files: response?.assets?.map((_, _index) => null),
        },
      }),
    );

    formData.append('map', JSON.stringify(map));

    response?.assets?.forEach((asset, index) => {
      formData.append(String(index), {
        uri: asset.uri,
        type: 'image/jpeg',
        name: `${uuidv4()}.jpeg`,
      });
    });

    const res = await request('', REQ_METHOD.MUTATION, formData);
    return res?.data.data.upload;
  };

  const unfollowCurMatMap = async () => {
    dispatch(updateIsLoadingAction(true));
    await removeUserFollower(curMatMap.id);
    dispatch(removeFollowingMatMapAction(curMatMap.id));
    findAndSetCurMatMapByID(userOwnMaps[0].id);
    setDropDownValue(dropDownItems[0].value);
    dispatch(updateIsLoadingAction(false));
  };

  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();

  const renderItem = (matZip: MatZip) => {
    const distance = calculateDistance(matZip.coordinate, currentLocation);
    const distanceDisplay =
      distance > 1000 ? `${(distance / 1000).toFixed(1)}km` : `${distance}m`;
    return (
      <>
        <SwipeableRow
          onSwipeableRightOpen={() => {
            onDeleteMatZip(matZip.id);
          }}
          borderRadius={10}
          renderRight={curMatMap.authorId === curUser.id ? true : false}>
          <TouchableOpacity
            activeOpacity={1}
            key={matZip.id}
            style={styles.itemContainer}
            onPress={() => {
              setMarker(matZip);
              const newRegion: Region = {
                latitude: matZip.coordinate.latitude,
                longitude: matZip.coordinate.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              };
              mapRef.current?.animateToRegion(newRegion, 0);
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
                  나와의 거리 {distanceDisplay}
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
        <View style={{height: 5, backgroundColor: 'white'}} />
      </>
    );
  };
  return (
    <View style={{flex: 1}}>
      <Modal
        visible={isEditPublicMapVisible}
        transparent
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          display: isEditPublicMapVisible ? 'flex' : 'none',
        }}>
        <View style={styles.modalContainer} />
        <View style={styles.popupContainer}>
          <Text
            style={{
              color: colors.white,
              alignSelf: 'center',
              paddingVertical: 5,
              fontSize: 16,
              fontWeight: 'bold',
              paddingBottom: 10,
            }}>
            다른 유저들의 이목을 이끌만한 맛맵 이름과 사진을 정해주세요!
          </Text>
          <Text style={{color: colors.white, paddingBottom: 10, fontSize: 16}}>
            맛맵 이름
          </Text>
          <TextInput
            style={styles.input}
            placeholder={'믿고 한번 눌러봐'}
            placeholderTextColor={'rgba(243, 243, 243, 0.6)'}
            onChangeText={value => setNewPublicMapName(value)}
          />
          <TouchableOpacity
            style={{flexDirection: 'row', paddingVertical: 10}}
            onPress={onPressChoosePhoto}>
            <Text style={{color: colors.white, fontSize: 16}}>사진 선택</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={14}
              color={'white'}
              style={{alignSelf: 'center'}}
            />
          </TouchableOpacity>
          {imgLibraryResponse && imgLibraryResponse.assets ? (
            <Image
              style={{width: 100, height: 100, alignSelf: 'center'}}
              source={{uri: imgLibraryResponse.assets[0].uri}}
              resizeMode="contain"
            />
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 12,
            }}>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => {
                setNewPublicMapName('');
                setIsEditPublicMapVisible(!isEditPublicMapVisible);
                setImgLibraryResponse(undefined);
              }}>
              <Text style={{color: colors.white, fontSize: 16}}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={requestPublicMapChange}>
              <Text
                style={{color: colors.white, fontSize: 16, fontWeight: 'bold'}}>
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <GestureHandlerRootView style={{flex: 1}}>
        <View
          style={{...styles.searchTextInputContainer, paddingTop: insets.top}}>
          {isSearchGoogle ? (
            <GooglePlacesAutocomplete
              minLength={1}
              debounce={500}
              placeholder="구글 지도에서 장소를 검색해보세요!"
              textInputProps={{
                placeholderTextColor: 'black',
                caretHidden: true,
              }}
              query={{
                key: Config.MAPS_API,
                language: 'ko',
                components: 'country:kr|country:us',
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
                  caretHidden={true}
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
                {searchQuery.length === 0 ? (
                  <Ionicons
                    name="search-outline"
                    style={{position: 'absolute', right: 5, top: 9}}
                    size={24}
                    color={colors.coral1}
                  />
                ) : null}
                {searchQuery.length > 0 ? (
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
                ) : null}
              </View>
              {searchedMatZips && searchQuery.length !== 0 ? (
                <View
                  style={{
                    borderColor: colors.coral1,
                    borderWidth: 1,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    marginTop: 5,
                    maxHeight: 300,
                  }}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={searchedMatZips}
                    renderItem={renderSearchedItem}
                    contentContainerStyle={styles.searchResultContainer}
                    ListHeaderComponent={
                      isSearchResultLoading ? (
                        <View
                          style={{
                            borderBottomColor: 'grey',
                            borderBottomWidth: 0.17,
                          }}>
                          <ActivityIndicator
                            style={{
                              padding: 12,
                              alignSelf: 'flex-start',
                              borderBottomColor: 'grey',
                              borderBottomWidth: 0.17,
                            }}
                            size="small"
                            color={colors.coral1}
                          />
                        </View>
                      ) : null
                    }
                    ListFooterComponent={
                      <TouchableOpacity
                        onPress={() => {
                          setSearchQuery('');
                          setIsSearchGoogle(true);
                        }}
                        style={styles.searchResultEntry}>
                        <Text style={{color: colors.coral1}}>
                          검색 결과가 없으세요?
                        </Text>
                      </TouchableOpacity>
                    }
                  />
                </View>
              ) : null}
            </>
          )}
        </View>
        <View style={styles.container}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            followsUserLocation={true}
            onPress={e => {
              if (
                !e.nativeEvent.action ||
                e.nativeEvent.action !== 'marker-press'
              ) {
                setIsSearchGoogle(false);
                setMarker(null);
              }
            }}>
            {marker && (
              <>
                <Marker
                  key={`key_${marker.coordinate.latitude}_${marker.coordinate.longitude}`}
                  coordinate={marker.coordinate}
                  onPress={() => {
                    dispatch(updateIsLoadingAction(true));
                    navigation.navigate('MatZipMain', {
                      zipID: marker?.id,
                    });
                  }}>
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
              requestPermissionAndGetLocation(setCurrentLocation, mapRef);
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
                !userOwnMaps[0].zipList.find(zip => zip.id === marker.id) &&
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

          <BottomSheet ref={sheetRef} snapPoints={snapPoints} index={1}>
            {orderedMatZips && orderedMatZips.length !== 0 ? (
              <BottomSheetFlatList
                data={orderedMatZips}
                keyExtractor={i => i.id}
                renderItem={({item}) => renderItem(item)}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                  <View style={styles.bottomSheetHeader}>
                    <Text
                      style={{
                        fontSize: 20,
                        alignSelf: 'center',
                        marginLeft: 10,
                        color: colors.coral1,
                      }}>
                      근처 맛집들 📍
                    </Text>
                    <DropDownPicker
                      onOpen={() => {
                        if (isJustFollowed) {
                          dispatch(updateIsJustFollowed(false));
                        }
                      }}
                      containerStyle={styles.dropDownPickerContainer}
                      selectedItemContainerStyle={{
                        backgroundColor: colors.coral4,
                      }}
                      tickIconStyle={{display: 'none'}}
                      dropDownContainerStyle={{
                        borderColor: colors.coral1,
                        borderRadius: 12,
                        borderWidth: 1.3,
                      }}
                      textStyle={{color: colors.coral1}}
                      // eslint-disable-next-line react/no-unstable-nested-components
                      ArrowDownIconComponent={() => (
                        <View style={{flex: 1, flexDirection: 'row'}}>
                          <Ionicons
                            name="caret-down-circle"
                            size={20}
                            color={colors.coral1}
                            style={{alignSelf: 'center'}}
                          />
                          <View
                            style={{
                              marginLeft: 3,
                              height: 6,
                              width: 6,
                              alignSelf: 'center',
                              backgroundColor: '#40FF00',
                              borderRadius: 50,
                              display: isJustFollowed ? 'flex' : 'none',
                            }}
                          />
                        </View>
                      )}
                      // eslint-disable-next-line react/no-unstable-nested-components
                      ArrowUpIconComponent={() => (
                        <Ionicons
                          name="caret-up-circle"
                          size={20}
                          color={colors.coral1}
                        />
                      )}
                      style={{
                        minHeight: 40,
                        borderRadius: 12,
                        borderWidth: 1.3,
                        borderColor: colors.coral1,
                      }}
                      scrollViewProps={{
                        showsVerticalScrollIndicator: false,
                      }}
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
                ListFooterComponent={
                  <>
                    <View style={{height: 50}} />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                          onPress={onPressShareMatMap}
                          style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              alignSelf: 'center',
                              color: colors.coral1,
                              fontSize: 16,
                            }}>
                            {curMatMap.authorId === curUser.id
                              ? '내 맛맵 공유'
                              : '맛맵 공유'}
                          </Text>
                          <Ionicons
                            name="share-outline"
                            size={24}
                            color={colors.coral1}
                            style={{paddingLeft: 3}}
                          />
                        </TouchableOpacity>
                      </View>
                      {curMatMap.authorId === curUser.id ? (
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Text
                            style={{
                              alignSelf: 'center',
                              color: colors.coral1,
                              fontSize: 16,
                            }}>
                            내 맛맵 공개
                          </Text>
                          <Switch
                            thumbColor={'white'}
                            trackColor={{
                              false: 'grey',
                              true: colors.coral1,
                            }}
                            onValueChange={onPublicStatusChange}
                            value={curMatMap.publicStatus}
                            style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
                            ios_backgroundColor={colors.grey}
                          />
                        </View>
                      ) : null}
                      {curMatMap.authorId !== curUser.id ? (
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity
                            style={{alignSelf: 'center', flexDirection: 'row'}}
                            onPress={unfollowCurMatMap}>
                            <Text
                              style={{
                                alignSelf: 'center',
                                color: colors.coral1,
                                fontSize: 16,
                              }}>
                              언팔로우
                            </Text>
                            <Ionicons
                              name="person-remove-outline"
                              color={colors.coral1}
                              size={20}
                              style={{alignSelf: 'center', paddingLeft: 3}}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                    <View style={{height: 50}} />
                  </>
                }
                extraData={currentLocation}
              />
            ) : (
              <>
                <View style={{...styles.bottomSheetHeader, paddingTop: 1}}>
                  <Text
                    style={{
                      fontSize: 20,
                      alignSelf: 'center',
                      marginLeft: 20,
                      color: colors.coral1,
                    }}>
                    근처 맛집들 📍
                  </Text>
                  <DropDownPicker
                    onOpen={() => {
                      if (isJustFollowed) {
                        dispatch(updateIsJustFollowed(false));
                      }
                    }}
                    containerStyle={{
                      ...styles.dropDownPickerContainer,
                      paddingRight: 10,
                    }}
                    selectedItemContainerStyle={{
                      backgroundColor: colors.coral4,
                    }}
                    tickIconStyle={{display: 'none'}}
                    dropDownContainerStyle={{
                      borderColor: colors.coral1,
                      borderRadius: 12,
                      borderWidth: 1.3,
                    }}
                    textStyle={{color: colors.coral1}}
                    // eslint-disable-next-line react/no-unstable-nested-components
                    ArrowDownIconComponent={() => (
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <Ionicons
                          name="caret-down-circle"
                          size={20}
                          color={colors.coral1}
                          style={{alignSelf: 'center'}}
                        />
                        <View
                          style={{
                            marginLeft: 3,
                            height: 6,
                            width: 6,
                            alignSelf: 'center',
                            backgroundColor: '#40FF00',
                            borderRadius: 50,
                            display: isJustFollowed ? 'flex' : 'none',
                          }}
                        />
                      </View>
                    )}
                    // eslint-disable-next-line react/no-unstable-nested-components
                    ArrowUpIconComponent={() => (
                      <Ionicons
                        name="caret-up-circle"
                        size={20}
                        color={colors.coral1}
                      />
                    )}
                    style={{
                      minHeight: 40,
                      borderRadius: 12,
                      borderWidth: 1.3,
                      borderColor: colors.coral1,
                    }}
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
                    size={curMatMap.authorId === curUser.id ? 26 : 16}
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
                    {curMatMap.authorId === curUser.id
                      ? '저장하고 싶은 맛집을 \n검색해서 추가하세요!'
                      : '추가된 맛집이 없는 지도에요!'}
                  </Text>
                </View>
                <View
                  style={{
                    paddingTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      onPress={onPressShareMatMap}
                      style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          alignSelf: 'center',
                          color: colors.coral1,
                          fontSize: 16,
                        }}>
                        {curMatMap.authorId === curUser.id
                          ? '내 맛맵 공유'
                          : '맛맵 공유'}
                      </Text>
                      <Ionicons
                        name="share-outline"
                        size={24}
                        color={colors.coral1}
                        style={{paddingLeft: 3}}
                      />
                    </TouchableOpacity>
                  </View>
                  {curMatMap.authorId !== curUser.id ? (
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={{alignSelf: 'center', flexDirection: 'row'}}
                        onPress={unfollowCurMatMap}>
                        <Text
                          style={{
                            alignSelf: 'center',
                            color: colors.coral1,
                            fontSize: 16,
                          }}>
                          언팔로우
                        </Text>
                        <Ionicons
                          name="person-remove-outline"
                          color={colors.coral1}
                          size={20}
                          style={{alignSelf: 'center', paddingLeft: 3}}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}
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
    zIndex: 10000,
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 15,
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
    listView: {
      borderRadius: 10,
    },
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
    padding: 10,
    paddingTop: 0,
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
  },
  ourDBSearchBar: {
    height: 44,
    width: '100%',
    borderRadius: 10,
    borderColor: colors.coral1,
    borderWidth: 1,
    backgroundColor: 'white',
    fontSize: 15,
    paddingLeft: 10,
    color: 'black',
    includeFontPadding: true,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  searchResultContainer: {
    borderRadius: 10,
  },
  searchResultEntry: {
    padding: 12,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.17,
    alignContent: 'center',
  },
  modalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'grey',
    opacity: 0.85,
    zIndex: 10000,
    justifyContent: 'center',
  },
  popupContainer: {
    position: 'absolute',
    zIndex: 10000,
    top: Dimensions.get('window').height / 2 - 150,
    alignSelf: 'center',
    backgroundColor: colors.coral1,
    width: 250,
    padding: 12,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  input: {
    // color: '#989898',
    color: 'white',
    // borderBottomColor: '#eee',
    fontSize: 16,
    textAlign: 'left',
    borderColor: colors.coral2,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default App;
