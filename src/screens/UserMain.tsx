/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../components/Header';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import colors from '../styles/colors';
import assets from '../../assets';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {updateIsLoadingAction} from '../store/modules/globalComponent';
import {MatMap, MatZip} from '../types/store';
import {REQ_METHOD, request} from '../controls/RequestControl';
import {matZipSerializer} from '../serializer/MatZipSrlzr';
import {matMapSerializer} from '../serializer/MatMapSrlzr';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapCard from '../components/MapCard';
import {trimCountry} from '../tools/CommonFunc';
import Config from 'react-native-config';
let isLoading = false;

const UserMain = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const route = useRoute<RouteProp<ScreenParamList, 'UserMain'>>();
  const visitedZips = useAppSelector(state => state.visitedZips.visitedZips);
  const isGlobalLoading = useAppSelector(
    state => state.globalComponents.isLoading,
  );
  const {userEmail} = route.params;

  const [userVisitedZips, setUserVisitedZips] = useState<MatZip[]>([]);
  const [userFollowingMatMaps, setUserFollowingMatMaps] = useState<MatMap[]>(
    [],
  );
  const apiKey = Config.MAPS_API;
  const [userName, setUserName] = useState<string>('');
  const [joinedDate, setJoinedDate] = useState<string>('');

  useEffect(() => {
    if (isLoading) {
      return;
    }
    isLoading = true;
    // fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = (matZip: MatZip) => {
    return (
      <>
        <View style={{paddingHorizontal: 6}}>
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
                    ? {
                        uri: `https://maps.googleapis.com/maps/api/streetview?size=1200x1200&location=${matZip.coordinate.latitude},${matZip.coordinate.longitude}&key=${apiKey}`,
                      }
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingBottom: 5,
                }}>
                <Text
                  style={styles.itemSubtext}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {trimCountry(matZip.address)}
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
        </View>
        <View style={{height: 5, backgroundColor: 'transparent'}} />
      </>
    );
  };

  const fetchUserInfo = async () => {
    dispatch(updateIsLoadingAction(true));
    try {
      const fetchUserSavedZipsQuery = `{
        fetchUser(email: "${userEmail}") {
          username
          createdAt
          followingMaps {
            id
            name
            description
            createdAt
            publicStatus
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
      setUserName(fetchUserSavedZipsRes?.data.data.fetchUser.username);
      const date: Date = new Date(
        fetchUserSavedZipsRes?.data.data.fetchUser.createdAt,
      );
      const year: number = date.getUTCFullYear();
      const month: number = date.getUTCMonth() + 1;
      const day: number = date.getUTCDate();
      const dateString: string = `${year}년 ${month
        .toString()
        .padStart(2, '0')}월 ${day.toString().padStart(2, '0')}일`;
      setJoinedDate(dateString);
      if (fetchUserSavedZipsData && fetchUserSavedZipsData.length !== 0) {
        const visitedMatZips = await matZipSerializer(fetchUserSavedZipsData);
        setUserVisitedZips(visitedMatZips);
      }
      const fetchUserFollowedMapsData =
        fetchUserSavedZipsRes?.data.data.fetchUser.followingMaps;
      if (fetchUserFollowedMapsData && fetchUserFollowedMapsData.length !== 0) {
        const followingMatMaps = await matMapSerializer(
          fetchUserFollowedMapsData,
        );
        setUserFollowingMatMaps(followingMatMaps);
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(updateIsLoadingAction(false));
      isLoading = false;
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Header
        onPressBack={() => {
          navigation.goBack();
        }}
        color={colors.white}
        buttonColor={colors.coral1}
      />
      {isGlobalLoading ? null : (
        <ScrollView
          style={{
            flex: 1,
            paddingHorizontal: 18,
            paddingTop: 12,
          }}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              height: 140,
              width: '100%',
              flexDirection: 'row',
              borderRadius: 12,
              padding: 10,
              backgroundColor: colors.grey,
            }}>
            <Image
              source={assets.images.default_profile}
              resizeMode="contain"
              style={{
                height: 100,
                width: 100,
                borderRadius: 500,
                alignSelf: 'center',
                marginLeft: 18,
              }}
            />
            <View
              style={{
                // justifyContent: 'center',
                paddingLeft: '11%',
                justifyContent: 'space-around',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  maxWidth: '70%',
                }}>
                <Ionicons
                  name="person-circle-outline"
                  color={'black'}
                  size={18}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    paddingLeft: 6,
                    fontWeight: '400',
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {userName}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Ionicons name="person-add-outline" color={'black'} size={18} />
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: '400',
                    color: 'black',
                    paddingLeft: 6,
                  }}>
                  {joinedDate}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Ionicons name="analytics-outline" color={'black'} size={18} />
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: '300',
                    color: 'black',
                    paddingLeft: 6,
                  }}>
                  -
                </Text>
              </View>
            </View>
          </View>
          {userFollowingMatMaps.length > 0 && (
            <View
              style={{
                borderRadius: 12,
                backgroundColor: colors.grey,
                paddingTop: 16,
                paddingBottom: 4,
                marginTop: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: 12,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    paddingLeft: 16,
                    fontWeight: '500',
                    alignSelf: 'center',
                    paddingRight: 4,
                  }}>
                  {'팔로우하는 공개 맛맵'}
                </Text>
                <Ionicons name="map-outline" size={18} />
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={userFollowingMatMaps.filter(
                  map => map.publicStatus === true,
                )}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <MapCard
                    map={item}
                    onPressMap={() => {
                      navigation.navigate('ZipList', {
                        map: item,
                      });
                    }}
                    paddingHorizontal={16}
                    backgroundColor={'transparent'}
                    heightWidth={120}
                  />
                )}
              />
            </View>
          )}
          {userVisitedZips.length > 0 && (
            <View
              style={{
                borderRadius: 12,
                backgroundColor: colors.grey,
                paddingTop: 16,
                marginTop: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  paddingBottom: 8,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    fontWeight: '500',
                    paddingLeft: 16,
                    paddingRight: 4,
                  }}>
                  {'가본 맛집'}
                </Text>
                <Ionicons name="restaurant-outline" size={16} />
              </View>
              <FlatList
                data={userVisitedZips}
                renderItem={({item}) => renderItem(item)}
              />
            </View>
          )}
          <View style={{height: 50}} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.grey,
    borderRadius: 10,
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
    justifyContent: 'space-between',
  },
  itemSubtext: {
    color: 'black',
    paddingVertical: 2,
    fontWeight: '200',
    maxWidth: '90%',
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
  itemTitleText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    paddingBottom: 5,
    width: 150,
  },
});

export default UserMain;
