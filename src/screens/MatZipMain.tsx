/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCarousel from '../components/ImageCarousel';
import ReviewCard from '../components/ReviewCard';
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

const ExpandableView: React.FC<{expanded?: boolean; reviews?: Review[]}> = ({
  expanded = false,
  reviews,
}) => {
  const [height] = useState(new Animated.Value(0));

  const [orderedReviews, setOrderedReviews] = useState<Review[] | undefined>(
    reviews,
  );

  useEffect(() => {
    if (reviews) {
      setOrderedReviews(
        reviews.sort((a, b) => {
          return b.date.getTime() - a.date.getTime();
        }),
      );
    }
  }, [reviews]);

  useEffect(() => {
    Animated.timing(height, {
      toValue: !expanded ? (reviews ? reviews.length * 200 : 0) : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, height]);

  const renderItem = ({item}: {item: Review}) => <ReviewCard review={item} />;

  // REFACTOR: dynamic height
  const ITEM_HEIGHT = 60;

  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <Animated.View style={{height}}>
      <FlatList
        data={orderedReviews}
        keyExtractor={(item, index) => item.date.toISOString() + index}
        scrollEnabled={true}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        windowSize={10}
        removeClippedSubviews={true}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        // ListHeaderComponent={<ReviewForm />}
      />
      {/* <ReviewForm /> */}
    </Animated.View>
  );
};

export default function MatZipMain() {
  const route = useRoute<RouteProp<ScreenParamList, 'MatZipMain'>>();
  const zipId = route.params.zipID;

  const dispatch = useDispatch();

  // const zipDataFromStore = useAppSelector(state =>
  //   state.userMaps.ownMaps[0].zipList.find(zip => zip.id === zipId),
  // );
  const visitedZips = useAppSelector(state => state.visitedZips.visitedZips);
  const [zipData, setZipData] = useState<MatZip | undefined>(undefined);
  const [parentMap, setParentMap] = useState<string[] | undefined>(undefined);

  const matZipFromZipId = async () => {
    try {
      const fetchZipQuery = `{
        fetchZip(id: "${zipId}") {
          id
          name
          address
          reviewCount
          reviewAvgRating
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
        defaultStreetViewImg = `https://maps.googleapis.com/maps/api/streetview?size=1200x1200&location=${location.latitude},${location.longitude}&key=${apiKey}`;
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
        imageSrc:
          fetchedZipData.images === undefined ||
          fetchedZipData.images.length !== 0
            ? fetchedZipData.images.map((image: any) => image.src)
            : defaultStreetViewImg,
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
          author: review.writer.name,
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
  const handlePressReviewChevron = () => {
    // navigation.navigate('MatZip', {id: zipId});
    setToggleReview(prev => !prev);
    // show review shen toggled
  };
  const [toggleReview, setToggleReview] = useState(true);
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
  const [reviews, setReviews] = useState<Review[]>([]);
  return zipData ? (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView bounces={false} contentContainerStyle={styles.containter}>
        <ImageCarousel images={images} />
        {/* {images?.length === 0 ? (
          <Image
            source={assets.images.placeholder}
            style={{width: '100%', height: 220}}
          />
        ) : (
          <ImageCarousel images={images} />
        )} */}
        <View style={styles.matZipContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <View style={styles.horizontal}>
                <Text
                  style={styles.zipNameText}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {zipData?.name}
                </Text>
                <View style={{flex: 1}} />
              </View>

              <Text style={styles.matZipListText}>
                {parentMap &&
                  parentMap.length > 0 &&
                  (parentMap.length > 2
                    ? `${parentMap[0]}, ${parentMap[1]} 외 ${
                        parentMap.length - 2
                      }개의 맛맵에 포함`
                    : parentMap.length === 2
                    ? `${parentMap[0]}, ${parentMap[1]} 맛맵에 포함`
                    : `${parentMap[0]} 맛맵에 포함`)}
              </Text>
              <View
                style={{
                  ...styles.horizontal,
                  marginTop: parentMap && parentMap.length === 0 ? -27 : 0,
                }}>
                <Ionicons name="location-outline" color="black" size={18} />
                <Text style={styles.matZipInfoText}>{zipData?.address}</Text>
              </View>
              <Text style={styles.matZipDescriptionText}>
                {zipData?.description}
              </Text>
            </View>
            <View style={{alignContent: 'center'}}>
              <View
                style={{
                  backgroundColor: '#f2f2f2f2',
                  borderRadius: 8,
                  padding: 7,
                  marginTop: 10,
                }}>
                <View style={{...styles.horizontal}}>
                  <Ionicons name="star" color={colors.coral1} size={15} />
                  <Text style={styles.matZipRatingText}>
                    {ratingAverage(reviews)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleIconPress}
                style={styles.saveIcon}>
                <Ionicons
                  name={
                    saveIcon ? 'checkmark-circle' : 'checkmark-circle-outline'
                  }
                  size={28}
                  color={colors.coral1}
                />
              </TouchableOpacity>
            </View>
          </View>

          {zipData && <ReviewForm zipId={zipData.id} setReviews={setReviews} />}
          <TouchableOpacity
            style={styles.row}
            onPress={handlePressReviewChevron}>
            <Text style={styles.rowText}>
              리뷰 {reviews ? reviews?.length : 0}개
            </Text>
            <View style={{flex: 1}} />
            <Ionicons
              name={
                toggleReview
                  ? 'chevron-forward-outline'
                  : 'chevron-down-outline'
              }
              color="white"
              size={22}
            />
          </TouchableOpacity>
          <ExpandableView expanded={toggleReview} reviews={reviews} />
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
    paddingHorizontal: 24,
  },
  zipNameText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    paddingBottom: 10,
    textAlign: 'left',
    width: 250,
  },
  matZipListText: {
    fontSize: 13,
    color: 'black',
    textAlign: 'left',
    marginBottom: 25,
  },
  matZipInfoText: {
    fontSize: 15,
    color: 'black',
    textAlign: 'left',
    marginLeft: 3,
    maxWidth: 250,
  },
  matZipDescriptionText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 2,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
});
