/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import ImageCarousel from '../components/ImageCarousel';
import ReviewCard from '../components/ReviewCard';
import {Zip} from '../types/store';

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
  assets.images.스시올로지,
  assets.images.야키토리나루토,
  assets.images.월량관,
];

// const matZip = [
//   {
//     name: '라멘1',
//     address: '서울시 중구 길동 13',
//     numReview: 432,
//     rating: 4.5,
//     isVisited: true,
//     numLike: 234,
//     category: '일본라멘',
//   },
// ];

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

const MatZip: React.FC<Zip> = ({
  name,
  stars,
  numReview,
  // imageSrc,
  address,
  distance,
  isVisited,
  category,
  // reviewList,
}) => {
  const handlePressReviewChevron = () => {
    // navigation.navigate('MatZip', {id: zipId});
    setToggleReview(prev => !prev);
    // show review shen toggled
    console.log('Review Chevron pressed');
  };
  const [toggleReview, setToggleReview] = useState(true);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={styles.containter}>
        <ImageCarousel images={images} />
        {/* <Text style={styles.zipNameText}>이름: {name}</Text>
        <Text style={styles.heading}>주소: {address}</Text>
        <Text style={styles.heading}>평점: {stars}</Text>
        <Text style={styles.heading}>리뷰수: {numReview}</Text>
        <Text style={styles.heading}>방문여부: {isVisited}</Text>
        <Text style={styles.heading}>좋아요: {distance}</Text>
        <Text style={styles.heading}>카테고리: {category}</Text> */}
        <View style={styles.matZipContainer}>
          <View style={styles.horizontal}>
            <Text style={styles.zipNameText}>맛집네임히어</Text>
            <View style={{flex: 1}} />
            <View
              style={{
                backgroundColor: '#f2f2f2f2',
                borderRadius: 8,
                padding: 7,
              }}>
              <View style={styles.horizontal}>
                <Ionicons name="star" color="orange" size={30} />
                <Text style={styles.matZipRatingText}>4.8</Text>
              </View>
            </View>
          </View>

          <Text style={styles.matZipListText}> @맛집리스트이름... 에 포함</Text>
          <View style={styles.horizontal}>
            <Ionicons name="location-outline" color="black" size={18} />
            <Text style={styles.matZipInfoText}> 서울시 마포구 동교로 123</Text>
          </View>
          <View style={styles.horizontal}>
            <Ionicons name="call-outline" color="black" size={18} />
            <Text style={styles.matZipInfoText}> 02-123-4567</Text>
          </View>

          <Text style={styles.heading}>리뷰수: {numReview}</Text>
          <Text style={styles.heading}>방문여부: {isVisited}</Text>
          <Text style={styles.heading}>좋아요: {distance}</Text>
          <Text style={styles.heading}>카테고리: {category}</Text>

          {/* if touched, icon chevron changes */}
          <TouchableOpacity
            style={styles.row}
            onPress={handlePressReviewChevron}>
            <Text style={styles.rowText}>리뷰</Text>
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
        </View>

        <FlatList
          data={reviews}
          keyExtractor={item => item.author}
          renderItem={({item}) => (
            <ReviewCard
              author={item.author}
              rating={item.rating}
              content={item.content}
              date={item.date}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

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
    fontSize: 18,
    color: 'gray',
    textAlign: 'left',
    marginBottom: 5,
  },
  matZipInfoText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
  },
  matZipRatingText: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 3,
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
    height: 50,
    backgroundColor: '#FF4000',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
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
});

export default MatZip;
