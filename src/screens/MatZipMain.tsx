/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import ImageCarousel from '../components/ImageCarousel';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import {ScreenParamList} from '../types/navigation';
import {MatZip, Review} from '../types/store';
import colors from '../styles/colors';
import {useAppSelector} from '../store/hooks';
import {REQ_METHOD, request} from '../controls/RequestControl';
import {addressToCoordinate, ratingAverage} from '../tools/CommonFunc';

const ExpandableView: React.FC<{expanded?: boolean; reviews?: Review[]}> = ({
  expanded = false,
  reviews,
}) => {
  const [height] = useState(new Animated.Value(0));

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
        data={reviews}
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

  const zipDataFromStore = useAppSelector(state =>
    state.userMaps.ownMaps[0].zipList.find(zip => zip.id === zipId),
  );
  const [zipData, setZipData] = useState<MatZip | undefined>(undefined);

  const matZipFromZipId = async () => {
    try {
      console.log('zipId is ', zipId);
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
        }
      }`;
      const fetchedZipRes = await request(fetchZipQuery, REQ_METHOD.QUERY);
      const fetchedZipData = fetchedZipRes?.data.data?.fetchZip;

      const location = await addressToCoordinate(fetchedZipData.address);
      const fetchReviewQuery = `{
        fetchReviewsByZipId(zipId: "${fetchedZipData.id}") {
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

      const selectedMatZip: MatZip = {
        id: fetchedZipData.id,
        name: fetchedZipData.name,
        imageSrc: fetchedZipData.images
          ? fetchedZipData.images.map((image: any) => image.src)
          : assets.images.placeholder,
        coordinate: location,
        reviews: fetchedReviewData ? fetchedReviewData : [],
        reviewAvgRating: fetchedZipData.reviewAvgRating,
        reviewCount: fetchedZipData.reviewCount,
        address: fetchedZipData.address,
        category: fetchedZipData.category,
      };
      setZipData(selectedMatZip);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (zipDataFromStore) {
      setZipData(zipDataFromStore);
    } else {
      matZipFromZipId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zipId, zipDataFromStore]);

  const images = zipData?.imageSrc;
  const handlePressReviewChevron = () => {
    // navigation.navigate('MatZip', {id: zipId});
    setToggleReview(prev => !prev);
    // show review shen toggled
  };
  const [toggleReview, setToggleReview] = useState(true);
  const [saveIcon, setSaveIcon] = useState(true);
  const handleIconPress = () => {
    setSaveIcon(prev => !prev);
    // save zip (add zip to user.savedZips)
    // use server API: communicate with backend
  };
  const [reviews, setReviews] = useState<Review[]>(
    zipData?.reviews ? zipData.reviews : [],
  );
  console.log(zipData?.reviews);
  return zipData ? (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.containter}>
        {images?.length === 0 ? (
          <Image
            source={assets.images.placeholder}
            style={{width: '100%', height: 220}}
          />
        ) : (
          <ImageCarousel images={images} />
        )}
        <View style={styles.matZipContainer}>
          <View style={styles.horizontal}>
            <Text style={styles.zipNameText}>{zipData?.name}</Text>

            <TouchableOpacity onPress={handleIconPress} style={styles.saveIcon}>
              <Ionicons
                name="bookmark-outline"
                size={28}
                color={saveIcon ? colors.coral1 : 'darkgrey'}
              />
            </TouchableOpacity>

            <View style={{flex: 1}} />
            <View
              style={{
                backgroundColor: '#f2f2f2f2',
                borderRadius: 8,
                padding: 7,
              }}>
              <View style={styles.horizontal}>
                <Ionicons name="star" color={colors.coral1} size={15} />
                <Text style={styles.matZipRatingText}>
                  {ratingAverage(zipData?.reviews)}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.matZipListText}> @muckit_list 맛집에 포함</Text>
          <View style={styles.horizontal}>
            <Ionicons name="location-outline" color="black" size={18} />
            <Text style={styles.matZipInfoText}>{zipData?.address}</Text>
          </View>
          <Text style={styles.matZipDescriptionText}>
            {zipData?.description}
          </Text>

          {zipData && <ReviewForm zipId={zipData.id} setReviews={setReviews} />}
          <TouchableOpacity
            style={styles.row}
            onPress={handlePressReviewChevron}>
            <Text style={styles.rowText}>리뷰 {zipData?.reviewCount}개</Text>
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
      </View>
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
    marginTop: 15,
    paddingBottom: 10,
    textAlign: 'left',
  },
  matZipListText: {
    fontSize: 13,
    color: 'black',
    textAlign: 'left',
    marginBottom: 25,
    marginTop: -5,
  },
  matZipInfoText: {
    fontSize: 15,
    color: 'black',
    textAlign: 'left',
    marginLeft: 3,
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
    marginTop: 10,
    marginLeft: 5,
  },
});
