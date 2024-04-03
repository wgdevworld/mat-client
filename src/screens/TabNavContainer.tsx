/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {
  Alert,
  Dimensions,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapMain from './MapMain';
import ListMaps from './ListMaps';
import SettingsMain from './SettingsMain';
import MuckitNotes from './MuckitNotes';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import {useDispatch} from 'react-redux';
import {
  updateIsJustFollowed,
  updateIsLoadingAction,
} from '../store/modules/globalComponent';
import {addUserFollower} from '../controls/MatMapControl';
import {addFollowingMatMapAction} from '../store/modules/userMaps';
import {REQ_METHOD, request} from '../controls/RequestControl';
import {matMapSerializer} from '../serializer/MatMapSrlzr';
import {useAppSelector} from '../store/hooks';
import {addFollowingIdAction} from '../store/modules/user';

const screenWidth = Dimensions.get('window').width;
let isDeepLinkLoading = false;

const Tab = createBottomTabNavigator();

const TabNavContainer = () => {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const dispatch = useDispatch();
  const userOwnMaps = useAppSelector(state => state.userMaps.ownMaps);
  const userFollowingMaps = useAppSelector(
    state => state.userMaps.followingMaps,
  );
  const receiveFollowId = useAppSelector(state => state.user.receiveFollowId);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  // DeepLink navigation
  useEffect(() => {
    const deepLinkNavigation = async (url: string) => {
      if (isDeepLinkLoading) {
        // console.log('DeepLink is loading');
        return;
      }
      isDeepLinkLoading = true;
      if (!url) {
        return;
      }

      const route = url.split('?')[0]?.replace(/.*?:\/\//g, '');

      if (route === 'follow_map') {
        const mapId = url.split('?')[1]?.split('=')[1];

        navigation.navigate('TabNavContainer', {
          screen: 'Map',
        });

        const isAlreadyFollowing = userFollowingMaps.some(map => {
          return map.id === mapId;
        });

        if (mapId === userOwnMaps[0].id) {
          setIsAlertVisible(true);
          if (!isAlertVisible) {
            Alert.alert(
              '본인 맛맵입니다!',
              '',
              [
                {
                  text: 'OK',
                  onPress: () => setIsAlertVisible(false),
                },
              ],
              {cancelable: false},
            );
          }
        } else if (isAlreadyFollowing) {
          setIsAlertVisible(true);
          if (!isAlertVisible) {
            Alert.alert(
              '이미 팔로우중인 맛맵입니다!',
              '',
              [
                {
                  text: 'OK',
                  onPress: () => setIsAlertVisible(false),
                },
              ],
              {cancelable: false},
            );
          }
        } else {
          dispatch(updateIsLoadingAction(true));
          addUserFollower(mapId)
            .then(async () => {
              const fetchMapQuery = `{
              fetchMap(id: "${mapId}") {
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
            }
            `;
              const fetchMapRes = await request(
                fetchMapQuery,
                REQ_METHOD.QUERY,
              );
              const fetchMapData = fetchMapRes?.data.data.fetchMap;
              if (fetchMapData) {
                const map = await matMapSerializer([fetchMapData]);
                dispatch(addFollowingMatMapAction(map[0]));
                dispatch(updateIsJustFollowed(true));
                dispatch(addFollowingIdAction(mapId));
                const updateUserVariables = {
                  updateUserInput: {
                    institution: receiveFollowId.join(','),
                  },
                };
                const updateUserQuery = `
                    mutation updateUser($updateUserInput: UpdateUserInput!) {
                        updateUser(userInput: $updateUserInput) {
                          institution
                    }
                }`;
                request(
                  updateUserQuery,
                  REQ_METHOD.MUTATION,
                  updateUserVariables,
                );
              } else {
                console.error('Error fetching map:', fetchMapData);
              }
            })
            .catch(error => {
              console.error('Error adding follower:', error);
            })
            .finally(() => {
              dispatch(updateIsLoadingAction(false));
            });
        }
      }
      isDeepLinkLoading = false;
    };

    Linking.getInitialURL().then(value => {
      if (!value) {
        return;
      }
      deepLinkNavigation(value);
    });

    Linking?.addEventListener('url', e => {
      deepLinkNavigation(e.url);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const [appState, setAppState] = useState(AppState.currentState);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener('change', nextAppState => {
  //     if (appState.match(/inactive|background/) && nextAppState === 'active') {
  //       console.log('App has come to the foreground!');
  //       ShareMenu.getInitialShare(handleShare);
  //       // Place your code here that you want to run every time the app is opened
  //     }
  //     setAppState(nextAppState);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [appState]);

  //Handle Sharing
  // const handleShare: ShareCallback = (share?: ShareData) => {
  //   if (!share) {
  //     return;
  //   }
  //   // setAppState(null);
  //   console.log(share);
  // };
  // useEffect(() => {
  //   const listener = ShareMenu.addNewShareListener(handleShare);

  //   return () => {
  //     listener.remove();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // const [appState, setAppState] = useState(AppState.currentState);
  // const [sharedData, setSharedData] = useState<ShareData | null>(null);

  // const handleShare: ShareCallback = (share?: ShareData) => {
  //   if (!share) {
  //     return;
  //   }
  //   console.log('Shared content:', share);
  //   // Optionally, set shared data to state or perform other actions.
  //   setSharedData(share);
  // };

  // useEffect(() => {
  //   // Check for shared content when the app is opened or comes to the foreground.
  //   const handleAppStateChange = (nextAppState: string) => {
  //     if (appState.match(/inactive|background/) && nextAppState === 'active') {
  //       ShareMenu.getInitialShare(handleShare);
  //     }
  //     setAppState(nextAppState);
  //   };

  //   const appStateListener = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   );

  //   // Listener for new shares when the app is already open
  //   const listener = ShareMenu.addNewShareListener(handleShare);

  //   return () => {
  //     appStateListener.remove();
  //     listener.remove();
  //   };
  // }, [appState]);
  const MyTabBar = ({state, navigation: TabNavigation}: BottomTabBarProps) => {
    return (
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = TabNavigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              TabNavigation.navigate('TabNavContainer', {
                screen: route.name,
              });
            }
          };
          let icon = null;
          switch (route.name) {
            case 'Map':
              icon = (
                <Ionicons
                  name="map-outline"
                  size={screenWidth * 0.08}
                  color="black"
                />
              );
              break;
            case 'List':
              icon = (
                <Ionicons
                  name="star-outline"
                  size={screenWidth * 0.08}
                  color="black"
                />
              );
              break;
            case 'Community':
              icon = (
                <Ionicons
                  name="reader-outline"
                  size={screenWidth * 0.08}
                  color="black"
                />
              );
              break;
            case 'Settings':
              icon = (
                <Ionicons
                  name="person-circle-outline"
                  size={screenWidth * 0.08}
                  color="black"
                />
              );
              break;
            default:
              icon = null;
              break;
          }

          return (
            <TouchableOpacity
              key={index}
              style={{
                ...styles.iconContainer,
                opacity: index === state.index ? 1 : 0.5,
              }}
              onPress={onPress}>
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      initialRouteName={'Map'}
      screenOptions={() => {
        return {
          lazy: false,
          headerShown: false,
        };
      }}>
      <Tab.Screen name="Map" component={MapMain} />
      <Tab.Screen name="List" component={ListMaps} />
      <Tab.Screen name="Community" component={MuckitNotes} />
      <Tab.Screen name="Settings" component={SettingsMain} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    width: '100%',
    backgroundColor: colors.white,
  },
  iconContainer: {
    flex: 1,
    width: 94,
    height: 58,
    paddingBottom: 22,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default TabNavContainer;
