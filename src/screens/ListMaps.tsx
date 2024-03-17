/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import MapCard from '../components/MapCard';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../store/hooks';
import {Coordinate, MatMap} from '../types/store';
import {matMapSerializer} from '../serializer/MatMapSrlzr';
import {replacePublicMapsAction} from '../store/modules/publicMaps';
import {REQ_METHOD, request} from '../controls/RequestControl';
import colors from '../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';

export default function ListMaps() {
  const dispatch = useDispatch();
  const publicMaps = useAppSelector(state => state.publicMaps.maps);
  const isUserOwnMapPublic = useAppSelector(
    state => state.userMaps.ownMaps[0].publicStatus,
  );
  const userName = useAppSelector(state => state.user.username);

  const FETCH_COOLDOWN = 2 * 60 * 1000;

  const [location, setLocation] = useState<Coordinate | null>(null);

  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const [orderedMaps, setOrderedMaps] = useState<MatMap[]>(publicMaps);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkNeedToFetch = async () => {
    const now = new Date().getTime();
    const lastFetch = await AsyncStorage.getItem('lastFetchTime');
    const lastFetchTime = lastFetch ? parseInt(lastFetch, 10) : 0;

    return now - lastFetchTime > FETCH_COOLDOWN;
  };

  const updateFetchTime = async () => {
    const now = new Date().getTime();
    await AsyncStorage.setItem('lastFetchTime', now.toString());
  };

  const onRefreshPublicMaps = useCallback(async () => {
    setIsRefreshing(true);
    try {
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
                username
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
      const publicMapsRes = await request(fetchAllMapsQuery, REQ_METHOD.QUERY);
      const publicMapsData = publicMapsRes?.data?.data?.fetchAllMaps;
      if (publicMapsData) {
        const serializedPublicMaps: MatMap[] = await matMapSerializer(
          publicMapsData,
        );
        if (!isUserOwnMapPublic) {
          const filteredPublicMaps = serializedPublicMaps.filter(
            map => map.author === '운영자',
          );
          dispatch(replacePublicMapsAction(filteredPublicMaps));
        } else {
          dispatch(replacePublicMapsAction(serializedPublicMaps));
        }
      }
      updateFetchTime();
    } catch (e) {
      console.log(e);
    } finally {
      setIsRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkNeedToFetch]);

  useEffect(() => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation(prevState => ({
            ...prevState,
            latitude: latitude,
            longitude: longitude,
          }));
        },
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 3600,
          maximumAge: 3600,
        },
      );
    } catch (e) {
      console.log(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (await checkNeedToFetch()) {
          onRefreshPublicMaps();
        }
      };
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onRefreshPublicMaps]),
  );

  const orderMaps = () => {
    const newOrdered = [...publicMaps];
    const sorted = newOrdered.sort((a, b) => {
      return b.numFollower! - a.numFollower!;
    });
    return sorted;
  };

  useEffect(() => {
    setOrderedMaps(orderMaps());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicMaps]);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.containter}>
        <View>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefreshPublicMaps}
                tintColor={colors.coral1}
              />
            }
            showsVerticalScrollIndicator={false}
            data={orderedMaps}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <MapCard
                map={item}
                onPressMap={() => {
                  navigation.navigate('ZipList', {
                    map: item,
                    location: location,
                  });
                }}
              />
            )}
            ListHeaderComponent={
              <Text style={styles.heading}>맛맵 탐색 🚀 </Text>
            }
            ListHeaderComponentStyle={{backgroundColor: 'white'}}
            ListFooterComponent={
              isUserOwnMapPublic ? (
                <View style={{height: 50}} />
              ) : (
                <View style={{flex: 1, height: 100, width: '100%'}}>
                  <LinearGradient
                    colors={['#ffffff', colors.coral1]}
                    style={{flex: 1}}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 3}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignSelf: 'center',
                        paddingTop: 25,
                      }}>
                      <Ionicons
                        name="information-circle-outline"
                        size={26}
                        color={colors.coral1}
                        style={{alignSelf: 'center'}}
                      />
                      <Text
                        style={{
                          alignSelf: 'center',
                          maxWidth: '80%',
                          textAlign: 'center',
                          color: colors.coral1,
                        }}>{`다른 사용자들의 맛맵을 보고 싶다면 \n ${userName}님의 맛맵 공개 설정을 바꿔주세요!`}</Text>
                    </View>
                  </LinearGradient>
                </View>
              )
            }
            stickyHeaderIndices={[0]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containter: {
    paddingTop: 24,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'left',
    paddingLeft: 24,
  },
  map: {
    height: 100,
    backgroundColor: '#FF4000',
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  mapName: {
    fontSize: 19,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  mapText: {
    marginTop: 5,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});
