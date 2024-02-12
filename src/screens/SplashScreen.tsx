import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import React, {useEffect, useRef} from 'react';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';

import {REQ_METHOD, request} from '../controls/RequestControl';
import {useDispatch} from 'react-redux';
import {MatMap, MuckitItem} from '../types/store';
import {
  replaceFollowingMatMapAction,
  replaceOwnMatMapAction,
} from '../store/modules/userMaps';
import {replaceOwnMuckitemsAction} from '../store/modules/userItems';
import {replacePublicMapsAction} from '../store/modules/publicMaps';
import {matMapSerializer} from '../serializer/MatMapSrlzr';
import {updateUserIdAction, updateUsernameAction} from '../store/modules/user';
import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import assets from '../../assets';
import colors from '../styles/colors';
import {matZipSerializer} from '../serializer/MatZipSrlzr';
import {replaceVisitedMatZipsAction} from '../store/modules/visitedZips';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();

  useEffect(() => {
    AsyncStorage.getItem(ASYNC_STORAGE_ENUM.IS_LOGGED_IN).then(loggedIn =>
      loggedIn == null
        ? navigation.replace('LoginMain')
        : AsyncStorage.getItem(ASYNC_STORAGE_ENUM.ID_TOKEN)
            .then(async value => {
              if (value == null) {
                navigation.replace('LoginMain');
              } else {
                const fetchLoggedInQuery = `{
                  fetchLoggedIn {
                    id
                    email
                    username
                  }
                }
                `;
                const curUserRes = await request(
                  fetchLoggedInQuery,
                  REQ_METHOD.QUERY,
                );
                // console.log(curUserRes?.data.data.fetchLoggedIn);
                const curUserId = curUserRes?.data.data.fetchLoggedIn.id;
                const curUserEmail = curUserRes?.data.data.fetchLoggedIn.email;
                const curUserUsername =
                  curUserRes?.data.data.fetchLoggedIn.username;
                dispatch(updateUserIdAction(curUserId));
                dispatch(updateUsernameAction(curUserUsername));
                await AsyncStorage.setItem(
                  ASYNC_STORAGE_ENUM.USER_EMAIL,
                  curUserEmail,
                );
                const fetchUserMapQuery = `{
                  fetchUserMap {
                    id
                    name
                    description
                    createdAt
                    publicStatus
                    creator {
                      id
                      name
                    }
                    images {
                      src
                    }
                    zipList {
                      id
                      name
                      address
                      images {
                        src
                      }
                      reviewCount
                      reviewAvgRating
                      parentMap {
                        id
                      }
                      category
                      latitude
                      longitude
                    }
                  }
                }`;
                const userOwnMapRes = await request(
                  fetchUserMapQuery,
                  REQ_METHOD.QUERY,
                );
                const userOwnMapData = userOwnMapRes?.data.data
                  ? userOwnMapRes?.data.data.fetchUserMap
                  : null;
                if (userOwnMapData) {
                  const userOwnMap = await matMapSerializer([userOwnMapData]);
                  dispatch(replaceOwnMatMapAction(userOwnMap));
                } else {
                  //if the user doesn't have a MatMap yet, create a default one for them
                  console.log('ℹ️ no MatMap found, creating default one');
                  const variables = {
                    mapInfo: {
                      name: '기본 맛맵',
                      description: `${curUserUsername}님의 첫 맛맵`,
                      areaCode: '',
                      publicStatus: false,
                      imageSrc: '',
                    },
                  };
                  const createUserMapQuery = `
                  mutation createMap($mapInfo: CreateMapInput!) {
                    createMap(mapInfo: $mapInfo) {
                      id
                      name
                      description
                      publicStatus
                      creator {
                        id
                        name
                      }
                      images {
                        src
                      }
                    }
                  }`;
                  const createMapRes = await request(
                    createUserMapQuery,
                    REQ_METHOD.MUTATION,
                    variables,
                  );

                  const createMapData = createMapRes?.data.data.createMap;
                  const createMap: MatMap = {
                    id: createMapData.id,
                    name: createMapData.name,
                    description: createMapData.description,
                    publicStatus: createMapData.publicStatus,
                    author: createMapData.creator.name,
                    authorId: createMapData.creator.id,
                    imageSrc: createMapData.images,
                    zipList: [],
                    areaCode: '',
                  };
                  dispatch(replaceOwnMatMapAction([createMap]));
                }
                const fetchUserSavedZipsQuery = `{
                  fetchUser(email: "${curUserEmail}") {
                    savedZips {
                      id
                      name
                      address
                      images {
                        src
                      }
                      reviewCount
                      reviewAvgRating
                      parentMap {
                        id
                      }
                      category
                      latitude
                      longitude
                    }
                  }
                }`;
                const fetchUserSavedZipsRes = await request(
                  fetchUserSavedZipsQuery,
                  REQ_METHOD.QUERY,
                );
                const fetchUserSavedZipsData =
                  fetchUserSavedZipsRes?.data.data.fetchUser.savedZips;
                // console.log(fetchUserSavedZipsData);
                // console.log(fetchUserSavedZipsData.length);
                if (
                  fetchUserSavedZipsData &&
                  fetchUserSavedZipsData.length !== 0
                ) {
                  const visitedMatZips = await matZipSerializer(
                    fetchUserSavedZipsData,
                  );
                  // console.log('visited: ' + fetchUserSavedZipsData.length);
                  dispatch(replaceVisitedMatZipsAction(visitedMatZips));
                } else {
                  dispatch(replaceVisitedMatZipsAction([]));
                }
                const fetchFollowingMapQuery = `{
                  fetchMapsFollowed {
                    id
                    name
                    description
                    createdAt
                    publicStatus
                    creator {
                      id
                      name
                    }
                    images {
                      src
                    }
                    zipList {
                      id
                      name
                      address
                      images {
                        src
                      }
                      reviewCount
                      reviewAvgRating
                      parentMap {
                        id
                      }
                      category
                      latitude
                      longitude
                    }
                  }
                }`;
                const userFollowingMapRes = await request(
                  fetchFollowingMapQuery,
                  REQ_METHOD.QUERY,
                );
                const userFollowingMapData =
                  userFollowingMapRes?.data.data.fetchMapsFollowed;
                if (userFollowingMapData) {
                  const userFollowingMap = await matMapSerializer(
                    userFollowingMapData,
                  );
                  dispatch(replaceFollowingMatMapAction(userFollowingMap));
                }
                navigation.replace('TabNavContainer', {
                  screen: 'Map',
                });

                //유저 먹킷 리스트 불러오기
                const fetchMuckitemQuery = `{
                  fetchAllMuckitem {
                    id
                    title
                    description
                    completeStatus
                  }
                }`;
                const userMuckitemsRes = await request(
                  fetchMuckitemQuery,
                  REQ_METHOD.QUERY,
                );
                const userMuckitemsData =
                  userMuckitemsRes?.data?.data?.fetchAllMuckitem;

                if (userMuckitemsData) {
                  const serializedItemsList: MuckitItem[] = await Promise.all(
                    userMuckitemsData.map(async (item: any) => {
                      return {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        completeStatus: item.completeStatus,
                      } as MuckitItem;
                    }),
                  );
                  dispatch(replaceOwnMuckitemsAction(serializedItemsList));
                }

                const fetchAllMapsQuery = `{
                  fetchAllMaps {
                    id
                    name
                    description
                    createdAt
                    publicStatus
                    followerList {
                      id
                    }
                    creator {
                      id
                      name
                    }
                    images {
                      src
                    }
                    zipList {
                      id
                      name
                      address
                      images {
                        src
                      }
                      reviewCount
                      reviewAvgRating
                      parentMap {
                        id
                      }
                      category
                      latitude
                      longitude
                    }
                  }
                }`;
                const publicMapsRes = await request(
                  fetchAllMapsQuery,
                  REQ_METHOD.QUERY,
                );
                const publicMapsData = publicMapsRes?.data?.data?.fetchAllMaps;
                if (publicMapsData) {
                  const publicMaps: MatMap[] = await matMapSerializer(
                    publicMapsData,
                  );
                  dispatch(replacePublicMapsAction(publicMaps));
                }
              }
            })
            .catch(e => {
              console.log(e.response ? e.response.data : e.message);
            })
            .catch(e => {
              console.log(e);
            }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim]);

  return (
    <>
      <View style={styles.container}>
        <ImageBackground
          source={assets.images.splash_background}
          resizeMode="cover"
          style={styles.backgroundImage}
        />
      </View>
      <Animated.Text style={[styles.loadingText, {opacity: fadeAnim}]}>
        데이터 불러오는중...
      </Animated.Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 0,
    flex: 1,
  },
  backgroundImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingText: {
    position: 'absolute',
    bottom: Dimensions.get('window').height / 2 - 350,
    alignSelf: 'center',
    color: colors.white,
    fontWeight: '500',
  },
});

export default SplashScreen;
