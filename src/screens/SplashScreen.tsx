import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import React, {useEffect} from 'react';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';

import {REQ_METHOD, request} from '../controls/RequestControl';
import {useDispatch} from 'react-redux';
import {Coordinate, MatMap, MatZip, Review, MuckitItem} from '../types/store';
import {replaceOwnMatMapAction} from '../store/modules/userMaps';
import {v4 as uuidv4} from 'uuid';
import {addressToCoordinate} from '../tools/CommonFunc';
import {replaceOwnMuckitemsAction} from '../store/modules/userItems';
import {replacePublicMapsAction} from '../store/modules/publicMaps';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();

  useEffect(() => {
    AsyncStorage.getItem(ASYNC_STORAGE_ENUM.ID_TOKEN)
      .then(async value => {
        if (value == null) {
          navigation.replace('LoginMain');
        } else {
          //TODO: zipList 까지 불러오기
          const fetchUserMapQuery = `{
            fetchUserMap {
              id
              name
              description
              createdAt
              publicStatus
              creator {
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
              }
            }
          }`;
          const userOwnMapRes = await request(
            fetchUserMapQuery,
            REQ_METHOD.QUERY,
          );
          //TODO: zipList, followerList 까지 불러오기
          // const fetchFollowingMapQuery = `{
          //   fetchMapsFollowed {
          //     id
          //     name
          //     description
          //     publicStatus
          //     areaCode
          //   }
          // }`;
          // const userFollowingMapRes = await request(
          //   fetchFollowingMapQuery,
          //   REQ_METHOD.QUERY,
          // );
          // const userFollowingMapData = userFollowingMapRes?.data.data;
          const userOwnMapData = userOwnMapRes?.data?.data?.fetchUserMap;
          if (userOwnMapData) {
            const imgSrcArr = userOwnMapData.images.map((img: any) => img.src);
            const serializedZipList: MatZip[] = await Promise.all(
              userOwnMapData.zipList.map(async (zip: any) => {
                const imgSrcArr = zip.images.map((img: any) => img.src);
                const fetchReviewQuery = `{
                  fetchReviewsByZipId(zipId: "${zip.id}") {
                    writer {
                      name
                    }
                    rating
                    content
                    createdAt
                    images {
                      src
                    }
                  }
                }`;
                const fetchedReviewRes = await request(
                  fetchReviewQuery,
                  REQ_METHOD.QUERY,
                );
                const fetchedReviewData =
                  fetchedReviewRes?.data.data.fetchReviewsByZipId;
                const imageList = fetchedReviewData.reduce(
                  (acc: any[], review: any) => {
                    const reviewImages = review.images.map((image: any) => {
                      return {
                        src: image.src,
                      };
                    });
                    return acc.concat(reviewImages);
                  },
                  [],
                );
                const filteredReviewList: Review[] = fetchedReviewData.map(
                  (review: any) => {
                    return {
                      author: review.writer.name,
                      rating: review.rating,
                      content: review.content,
                      date: new Date(review.createdAt),
                      images: imageList,
                    };
                  },
                );
                let coordinate: Coordinate;
                try {
                  coordinate = await addressToCoordinate(zip.address);
                } catch (error) {
                  console.error(
                    `Failed to get coordinates for address: ${zip.address}`,
                    error,
                  );
                  coordinate = {latitude: 0, longitude: 0}; // Fallback
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
                  reviews: filteredReviewList,
                } as MatZip;
              }),
            );

            const userOwnMap: MatMap = {
              id: userOwnMapData.id,
              name: userOwnMapData.name,
              description: userOwnMapData.description,
              publicStatus: userOwnMapData.publicStatus,
              areaCode: userOwnMapData.areaCode,
              zipList: serializedZipList,
              followerList: userOwnMapData.followerList,
              imageSrc: imgSrcArr,
              author: userOwnMapData.creator.name,
            };
            dispatch(replaceOwnMatMapAction([userOwnMap]));
          } else {
            //if the user doesn't have a MatMap yet, create a default one for them
            console.log('ℹ️ no MatMap found, creating default one');
            const defaultMatMap: MatMap = {
              id: uuidv4(),
              name: '기본 맛맵',
              description: '유저의 첫 맛맵',
              imageSrc: [
                'https://storage.googleapis.com/kobon-01/seoul_hotple_logo.png',
              ],
              // TODO: replace with user.name when onboarding is finished (and createUserAction is in place)
              author: '사용자',
              followerList: [],
              publicStatus: false,
              areaCode: '',
              zipList: [],
            };
            const variables = {
              mapInfo: {
                name: defaultMatMap.name,
                description: defaultMatMap.description,
                areaCode: defaultMatMap.areaCode,
                publicStatus: defaultMatMap.publicStatus,
                imageSrc: '',
              },
            };

            const createUserMapQuery = `
              mutation createMap($mapInfo: CreateMapInput!) {
                createMap(mapInfo: $mapInfo) {
                  name
                }
              }`;

            await request(createUserMapQuery, REQ_METHOD.MUTATION, variables);
            dispatch(replaceOwnMatMapAction([defaultMatMap]));
          }
          navigation.replace('TabNavContainer', {
            screen: 'MapMain',
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
              areaCode
              creator {
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
              }
            }
          }`;
          const publicMapsRes = await request(
            fetchAllMapsQuery,
            REQ_METHOD.QUERY,
          );
          const publicMapsData = publicMapsRes?.data?.data?.fetchAllMaps;

          if (publicMapsData) {
            const maps: MatMap[] = await Promise.all(
              publicMapsData.map(async (map: any) => {
                const imgSrcArr = map.images.map((img: any) => img.src);
                console.log('🎯☎️' + imgSrcArr);
                const serializedZipList: MatZip[] = await Promise.all(
                  map.zipList.map(async (zip: any) => {
                    const imgSrcArr = zip.images.map((img: any) => img.src);
                    let coordinate: Coordinate;
                    try {
                      coordinate = await addressToCoordinate(zip.address);
                    } catch (error) {
                      console.error(
                        `Failed to get coordinates for address: ${zip.address}`,
                        error,
                      );
                      coordinate = {latitude: 0, longitude: 0}; // Fallback
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
                return {
                  id: map.id,
                  name: map.name,
                  description: map.description,
                  author: map.creator?.name,
                  publicStatus: map.publicStatus,
                  areaCode: map.areaCode,
                  zipList: serializedZipList,
                  imageSrc: imgSrcArr,
                } as MatMap;
              }),
            );
            dispatch(replacePublicMapsAction(maps));
          }
        }
      })
      .catch(e => {
        console.log(e.response ? e.response.data : e.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default SplashScreen;
