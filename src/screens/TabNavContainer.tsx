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
                console.log(map[0].id + 'added');
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
