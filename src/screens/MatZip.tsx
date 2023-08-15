/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useRoute} from '@react-navigation/native';
import axios from 'axios';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import ImageCarousel from '../components/ImageCarousel';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import {ScreenParamList} from '../types/navigation';
import {Review} from '../types/store';
import colors from '../styles/colors';


// interface MatZipProps {
//   name: string;
//   address: string;
//   numReview: number;
//   rating: number;
//   isVisited: boolean;
//   numLike: number;
//   category: string;
//   reviewList: string[];
//   // parent map list
// }

const images = [
  assets.images.산방산국수맛집1,
  assets.images.산방산국수맛집2,
  assets.images.애월제주다,
];

const ExpandableView = ({expanded = false}) => {
  const [height] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(height, {
      toValue: !expanded ? reviews.length * 200 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [expanded, height]);

  // console.log('rerendered');

  const renderItem = useCallback(
    ({item}: {item: Review}) => (
      <ReviewCard
        author={item.author}
        rating={item.rating}
        content={item.content}
        date={item.date}
      />
    ),
    [],
  );

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
        keyExtractor={item => item.author}
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

const reviews = [
  {
    author: '홍길동',
    rating: 4.5,
    content: '맛있어요!',
    date: new Date(),
  },
  {
    author: '이덕행',
    rating: 4.8,
    content: '사특한 맛이네요..',
    date: new Date(),
  },
  {
    author: '윤지원',
    rating: 2.2,
    content: '쉽지 않다...',
    date: new Date(),
  },
];

export default function MatZip() {
  const route = useRoute<RouteProp<ScreenParamList, 'MatZip'>>();
  const zipData = route.params;
  const handlePressReviewChevron = () => {
    // navigation.navigate('MatZip', {id: zipId});
    setToggleReview(prev => !prev);
    // show review shen toggled
    console.log('Review Chevron pressed');
  };
  const [toggleReview, setToggleReview] = useState(true);
  const [saveIcon, setSaveIcon] = useState(true);
  const handleIconPress = () => {
    setSaveIcon((prev) => !prev);
    // save zip (add zip to user.savedZips)
    // use server API: communicate with backend
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={styles.containter}>
        <ImageCarousel images={images} />
        <View style={styles.matZipContainer}>
          <View style={styles.horizontal}>
            <Text style={styles.zipNameText}>{zipData.zip.name}</Text>

            <TouchableOpacity onPress={handleIconPress} style={styles.saveIcon}>
            <Ionicons
              name='bookmark-outline'
              size={28}
              color={saveIcon ? colors.coral1 : "darkgrey"}
            />
          </TouchableOpacity>

            <View style={{flex: 1}} />
            <View
              style={{
                backgroundColor: '#f2f2f2f2',
                borderRadius: 8,
                padding: 7,
                height: 30,
                width: 50,
              }}>
              <View style={styles.horizontal}>
                <Ionicons name="star" color="orange" size={15} />
                <Text style={styles.matZipRatingText}>{zipData.zip.stars}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.matZipListText}> @muckit_list 맛집에 포함</Text>
          <View style={styles.horizontal}>
            <Ionicons name="location-outline" color="black" size={18} />
            <Text style={styles.matZipInfoText}>{zipData.zip.address}</Text>
          </View>
          <View style={styles.horizontal}>
            <Ionicons name="information-circle-outline" color="black" size={18} />
            <Text style={styles.matZipInfoText}> 02-123-4567</Text>
          </View>
          <Text style={styles.matZipDescriptionText}>
            산방산에 가면 먹어야 할 산방산뷰 국수집🥢 일반 국수도 넘 맛있지만
            여름 별미라는 시원한 서리태콩국수는 꼭 먹어봐🤭 직접 갈아만든
            콩육수라 역대급 담백고소함!
          </Text>

          {/* <Text style={styles.matZipInfoText}>
            리뷰수: {zipData.zip.numReview}
          </Text>
          <Text style={styles.matZipInfoText}>
            방문여부: {zipData.zip.isVisited ? '방문 전' : '방문함'}
          </Text>
          <Text style={styles.matZipInfoText}>좋아요: {zipData.zip.}</Text>
          <Text style={styles.matZipInfoText}>
            카테고리: {zipData.zip.category}
          </Text> */}
          <ReviewForm />
          {/* if touched, icon chevron changes */}
          <TouchableOpacity
            style={styles.row}
            onPress={handlePressReviewChevron}>
            <Text style={styles.rowText}>리뷰 {zipData.zip.numReview}개</Text>
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
          {/* <ReviewForm /> */}
          <ExpandableView expanded={toggleReview} />
          {/* <FlatList
            data={reviews}
            keyExtractor={item => item.author}
            scrollEnabled={false}
            renderItem={({item}) => (
              <ReviewCard
                author={item.author}
                rating={item.rating}
                content={item.content}
                date={item.date}
              />
            )}
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    marginBottom: 5,
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
    marginLeft: 3
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
    marginLeft: 5,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
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
    marginLeft: 5
  }
});
