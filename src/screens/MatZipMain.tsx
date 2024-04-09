/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Image,
  Linking,
  ActionSheetIOS,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCarousel from '../components/ImageCarousel';
import ReviewForm from '../components/ReviewForm';
import {ScreenParamList} from '../types/navigation';
import {Coordinate, MatZip, Review} from '../types/store';
import colors from '../styles/colors';
import {useAppSelector} from '../store/hooks';
import {REQ_METHOD, request} from '../controls/RequestControl';
import {ratingAverage} from '../tools/CommonFunc';
import Config from 'react-native-config';
import {useDispatch} from 'react-redux';
import {updateIsLoadingAction} from '../store/modules/globalComponent';
import {
  addVisitedMatZipAction,
  removeVisitedZipAction,
} from '../store/modules/visitedZips';
import Header from '../components/Header';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import ReviewCard from '../components/ReviewCard';
import {replaceOwnMatMapZipListAction} from '../store/modules/userMaps';

export default function MatZipMain() {
  const route = useRoute<RouteProp<ScreenParamList, 'MatZipMain'>>();
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();

  const onPressBack = () => {
    navigation.goBack();
  };
  const zipId = route.params.zipID;

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // const zipDataFromStore = useAppSelector(state =>
  //   state.userMaps.ownMaps[0].zipList.find(zip => zip.id === zipId),
  // );
  const visitedZips = useAppSelector(state => state.visitedZips.visitedZips);
  const userOwnList = useAppSelector(
    state => state.userMaps.ownMaps[0].zipList,
  );
  const userOwnMatMapId = useAppSelector(state => state.userMaps.ownMaps[0].id);
  const [zipData, setZipData] = useState<MatZip | undefined>(undefined);
  const [parentMap, setParentMap] = useState<string[] | undefined>(undefined);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);
  const matZipFromZipId = async () => {
    try {
      const fetchZipQuery = `{
        fetchZip(id: "${zipId}") {
          id
          name
          number
          address
          reviewCount
          reviewAvgRating
          description
          images {
            id
            src
          }
          parentMap {
            name
          }
          category
          longitude
          latitude
        }
      }`;
      const fetchedZipRes = await request(fetchZipQuery, REQ_METHOD.QUERY);
      const fetchedZipData = fetchedZipRes?.data.data?.fetchZip;

      // const location = await addressToCoordinate(fetchedZipData.address);
      const coordinate: Coordinate = {
        latitude: fetchedZipData.latitude,
        longitude: fetchedZipData.longitude,
      };

      // Update zip as street view image if no default image
      let defaultStreetViewImg;
      if (
        fetchedZipData.images === undefined ||
        fetchedZipData.images.length === 0
      ) {
        console.log('⛔️ no image');
        const apiKey = Config.MAPS_API;
        defaultStreetViewImg = `https://maps.googleapis.com/maps/api/streetview?size=1200x1200&location=${coordinate.latitude},${coordinate.longitude}&key=${apiKey}`;
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

      const selectedMatZip: MatZip = {
        id: fetchedZipData.id,
        name: fetchedZipData.name,
        place_id: fetchedZipData.number ? fetchedZipData.number : null,
        imageSrc:
          fetchedZipData.images === undefined ||
          fetchedZipData.images.length !== 0
            ? fetchedZipData.images.map((image: any) => image.src)
            : defaultStreetViewImg,
        description: fetchedZipData.description,
        coordinate: coordinate,
        reviewAvgRating: fetchedZipData.reviewAvgRating,
        reviewCount: fetchedZipData.reviewCount,
        address: fetchedZipData.address,
        category: fetchedZipData.category,
      };
      setZipData(selectedMatZip);
      const parentMapNames: string[] = fetchedZipData.parentMap.map(
        (parent: any) => parent.name,
      );
      setParentMap(parentMapNames);
    } catch (error) {
      console.log(error);
    }
  };

  const renderReviews = () => {
    const renderItem = ({item}: {item: Review}) => <ReviewCard review={item} />;
    return reviews && reviews.length !== 0 ? (
      <FlatList
        data={reviews}
        bounces={false}
        keyExtractor={(item, index) => item.date.toISOString() + index}
        scrollEnabled={true}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        windowSize={11}
        removeClippedSubviews={true}
        renderItem={renderItem}
      />
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          paddingTop: 16,
        }}>
        <Ionicons name="pencil-outline" size={16} color={colors.coral1} />
        <Text
          style={{
            color: colors.coral1,
            fontWeight: '500',
            fontSize: 16,
            paddingLeft: 6,
          }}>
          이 맛집의 첫 리뷰를 작성해주세요!
        </Text>
      </View>
    );
  };

  useEffect(() => {
    dispatch(updateIsLoadingAction(true));
    // if (zipDataFromStore) {
    //   setZipData(zipDataFromStore);
    //   console.log('from store');
    // } else {
    matZipFromZipId();
    // }
    const fetchReview = async () => {
      const fetchReviewQuery = `{
        fetchReviewsByZipId(zipId: "${zipId}") {
          writer {
            username
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
      const fetchedReviewRes = await request(
        fetchReviewQuery,
        REQ_METHOD.QUERY,
      );
      const fetchedReviewData = fetchedReviewRes?.data.data.fetchReviewsByZipId;
      const filteredReviewList = fetchedReviewData.map((review: any) => {
        const reviewImages = review.images.map((image: any) => {
          return {
            id: image.id,
            src: image.src,
          };
        });
        return {
          author:
            review.writer !== null ? review.writer.username : '탈퇴한 사용자',
          rating: review.rating,
          content: review.content,
          date: new Date(review.createdAt),
          images: reviewImages,
        };
      });
      setReviews(filteredReviewList);
      dispatch(updateIsLoadingAction(false));
    };
    fetchReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipId]);

  const images = zipData?.imageSrc;
  const [saveIcon, setSaveIcon] = useState(
    !!visitedZips.find(zip => zip.id === zipId),
  );
  const handleIconPress = async () => {
    dispatch(updateIsLoadingAction(true));
    try {
      let beenToThisMatZipQuery;
      if (saveIcon === false) {
        beenToThisMatZipQuery = `
      mutation dibsZip($zipId: String!) {
        dibsZip(zipId: $zipId) {
          id
        }
      }`;
      } else {
        beenToThisMatZipQuery = `
        mutation undibsZip($zipId: String!) {
          undibsZip(zipId: $zipId) {
            id
          }
        }`;
      }
      const variables = {
        zipId: zipId,
      };
      await request(beenToThisMatZipQuery, REQ_METHOD.MUTATION, variables);
      if (saveIcon === false) {
        dispatch(addVisitedMatZipAction(zipData));
      } else {
        dispatch(removeVisitedZipAction(zipData?.id));
      }
      setSaveIcon(prev => !prev);
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(updateIsLoadingAction(false));
    }
  };

  const handleAddPress = async () => {
    if (userOwnList.find(zip => zip.id === zipId)) {
      Alert.alert('이미 추가한 맛집입니다!');
      return;
    }
    try {
      dispatch(updateIsLoadingAction(true));
      const variables = {
        mapId: userOwnMatMapId,
        zipId: zipId,
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
          const apiKey = Config.MAPS_API;
          const defaultStreetViewImg = `https://maps.googleapis.com/maps/api/streetview?size=1200x1200&location=${zip.latitude},${zip.longitude}&key=${apiKey}`;
          const zipImgSrcArr = zip.images
            ? zip.images.map((img: any) => img.src)
            : [defaultStreetViewImg];

          const coordinate = {
            latitude: zip.latitude,
            longitude: zip.longitude,
          };

          return {
            id: zip.id,
            name: zip.name,
            imageSrc: zipImgSrcArr,
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

  const handleRedirectToNaver = () => {
    const zipName = zipData?.name;
    const url = `https://m.map.naver.com/search2/search.naver?query=${zipName}`;
    Linking.openURL(url);
  };

  const handleNavigate = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['취소', '네이버 지도', '카카오 지도'],
        cancelButtonIndex: 0,
      },
      //kakaomap://route?sp=37.537229,127.005515&ep=37.4979502,127.0276368&by=PUBLICTRANSIT
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          const naverMapUrl = `nmap://route/public?dlat=${
            zipData?.coordinate.latitude
          }&dlng=${zipData?.coordinate.longitude}&dname=${encodeURI(
            zipData?.name!,
          )}`;
          try {
            Linking.openURL(naverMapUrl);
          } catch (e) {
            Alert.alert('네이버 지도를 실행할 수 없습니다.');
            console.log(e);
          }
        } else if (buttonIndex === 2) {
          const kakaoMapUrl = `kakaomap://route?ep=${zipData?.coordinate.latitude},${zipData?.coordinate.longitude}&by=PUBLICTRANSIT`;
          try {
            Linking.openURL(kakaoMapUrl);
          } catch (e) {
            Alert.alert('카카오 지도를 실행할 수 없습니다.');
            console.log(e);
          }
        }
      },
    );
  };

  const [reviews, setReviews] = useState<Review[]>([]);
  return zipData ? (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Modal
        visible={isImageFullScreen}
        transparent={false}
        onRequestClose={() => setIsImageFullScreen(false)}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 10,
            top: insets.top,
            zIndex: 1,
          }}
          onPress={() => setIsImageFullScreen(false)}>
          <Ionicons
            name="close-circle-outline"
            size={30}
            color={colors.coral1}
          />
        </TouchableOpacity>
        <Swiper activeDotColor={colors.coral1} loop={false}>
          {images!.map((uri: any, _index) => (
            <View key={_index} style={styles.fullScreenImage}>
              <Image
                style={{width: '100%', height: '100%'}}
                resizeMode="contain"
                source={{uri: uri}}
              />
            </View>
          ))}
        </Swiper>
      </Modal>
      <Header
        onPressBack={onPressBack}
        color={'white'}
        buttonColor={colors.coral1}
      />
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.containter}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => {
            setIsImageFullScreen(true);
          }}>
          <ImageCarousel images={images} />
        </TouchableOpacity>

        {/* {images?.length === 0 ? (
          <Image
            source={assets.images.placeholder}
            style={{width: '100%', height: 220}}
          />
        ) : (
          <ImageCarousel images={images} />
        )} */}
        <View style={{paddingHorizontal: 24}}>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={styles.horizontal}>
              <Text
                style={styles.zipNameText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {zipData?.name}
              </Text>
              <View style={{flex: 1}} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
                paddingTop: 8,
              }}>
              <View
                style={{
                  backgroundColor: '#f2f2f2f2',
                  borderRadius: 8,
                  padding: 7,
                  height: 30,
                  marginLeft: 5,
                  alignSelf: 'center',
                }}>
                <View style={{...styles.horizontal}}>
                  <Ionicons name="star" color={colors.coral1} size={15} />
                  <Text style={styles.matZipRatingText}>
                    {ratingAverage(reviews)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {parentMap && parentMap.length > 0 && (
            <View
              style={{
                ...styles.horizontal,
              }}>
              <Text>@</Text>
              <Text style={styles.matZipListText}>
                {parentMap.length > 2
                  ? `${parentMap[0]}, ${parentMap[1]} 외 ${
                      parentMap.length - 2
                    }개의 맛맵에 포함`
                  : parentMap.length === 2
                  ? `${parentMap[0]}, ${parentMap[1]} 맛맵에 포함`
                  : `${parentMap[0]} 맛맵에 포함`}
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingTop: 16,
            }}>
            <View
              style={{
                ...styles.iconContainer,
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: 6,
              }}>
              <TouchableOpacity
                onPress={handleRedirectToNaver}
                style={styles.saveIcon}>
                <Ionicons name={'globe-outline'} size={20} color={'black'} />
              </TouchableOpacity>
              <Text style={styles.iconText}>웹 검색</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={handleNavigate}
                style={styles.saveIcon}>
                <Ionicons name={'arrow-redo'} size={20} color={'black'} />
              </TouchableOpacity>
              <Text style={styles.iconText}>길찾기</Text>
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={handleIconPress}
                style={styles.saveIcon}>
                <Ionicons
                  name={
                    saveIcon ? 'checkmark-circle' : 'checkmark-circle-outline'
                  }
                  size={20}
                  color={'black'}
                />
              </TouchableOpacity>
              <Text style={styles.iconText}>
                {saveIcon ? '방문 취소' : '방문 표시'}
              </Text>
            </View>
            <View
              style={{
                ...styles.iconContainer,
                borderTopRightRadius: 6,
                borderBottomRightRadius: 6,
              }}>
              <TouchableOpacity
                onPress={handleAddPress}
                style={styles.saveIcon}>
                <Ionicons name={'add-circle'} size={20} color={'black'} />
              </TouchableOpacity>
              <Text style={styles.iconText}>내 맛맵에 추가</Text>
            </View>
          </View>
          <View style={styles.matZipContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 16,
              }}>
              <View style={{width: '95%'}}>
                {zipData.description && (
                  <View
                    style={{
                      ...styles.horizontal,
                      paddingBottom: 5,
                    }}>
                    <Ionicons
                      name="information-circle-outline"
                      color="black"
                      size={18}
                    />
                    <Text style={styles.matZipDescriptionText}>
                      {zipData?.description}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    ...styles.horizontal,
                    paddingVertical: 5,
                    paddingBottom: 20,
                  }}>
                  <Ionicons name="location-outline" color="black" size={18} />
                  <Text style={styles.matZipInfoText}>{zipData?.address}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                padding: 6,
                borderTopEndRadius: 6,
                borderTopLeftRadius: 6,
                backgroundColor: colors.coral1,
                // marginBottom: 24,
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontWeight: 'bold',
                  paddingLeft: 6,
                  fontSize: 16,
                }}>{`후기 (${zipData.reviewCount}개)`}</Text>
            </View>
            {zipData && (
              <ReviewForm zipId={zipData.id} setReviews={setReviews} />
            )}
            {renderReviews()}
            {/* <ExpandableView expanded={toggleReview} reviews={reviews} /> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  ) : (
    <View />
  );
}

const styles = StyleSheet.create({
  containter: {},
  matZipContainer: {
    paddingBottom: 200,
  },
  fullScreenImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zipNameText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    maxWidth: 300,
    paddingTop: 8,
    paddingBottom: 2,
    textAlign: 'left',
  },
  matZipListText: {
    fontWeight: '500',
    fontSize: 13,
    marginLeft: 2,
    color: 'black',
    textAlign: 'left',
  },
  matZipInfoText: {
    fontSize: 13,
    color: 'black',
    textAlign: 'left',
    marginLeft: 5,
    maxWidth: '85%',
  },
  matZipDescriptionText: {
    fontSize: 13,
    color: 'black',
    textAlign: 'left',
    // maxWidth: '85%',
    marginLeft: 5,
  },
  matZipRatingText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingHorizontal: 5,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 40,
    backgroundColor: '#FF4000',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  rowText: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
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
  section: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  rowResultText: {
    fontSize: 16,
    color: '#989898',
  },
  input: {
    color: '#989898',
    fontSize: 16,
    textAlign: 'right',
  },
  delete: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: 'grey',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  deleteText: {
    fontSize: 17,
    color: 'red',
    fontWeight: 'bold',
  },
  saveIcon: {
    alignSelf: 'center',
  },
  iconContainer: {
    width: '25%',
    paddingVertical: 4,
    marginHorizontal: 2,
    borderColor: colors.grey3,
    borderWidth: 0.2,
    // borderRadius: 6,
  },
  iconText: {
    paddingTop: 4,
    alignSelf: 'center',
    fontSize: 12,
  },
});
