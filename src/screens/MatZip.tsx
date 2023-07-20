/* eslint-disable react-native/no-inline-styles */
import React from 'react';
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
import ReviewCard from './ReviewCard';

interface MatZipProps {
  name: string;
  address: string;
  numReview: number;
  rating: number;
  isVisited: boolean;
  numLike: number;
  category: string;
  reviewList: string[];
  // parent map list
}

const images = [
  assets.images.스시올로지,
  assets.images.야키토리나루토,
  assets.images.월량관,
];

const matZip = [
  {
    name: '라멘1',
    address: '서울시 중구 길동 13',
    numReview: 432,
    rating: 4.5,
    isVisited: true,
    numLike: 234,
    category: '일본라멘',
  },
];

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

const MatZip: React.FC<MatZipProps> = ({
  name,
  address,
  numReview,
  rating,
  isVisited,
  numLike,
  category,
  // reviewList,
}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={styles.containter}>
        <ImageCarousel images={images} />
        <Text style={styles.heading}>이름: {name}</Text>
        <Text style={styles.heading}>주소: {address}</Text>
        <Text style={styles.heading}>평점: {rating}</Text>
        <Text style={styles.heading}>리뷰수: {numReview}</Text>
        <Text style={styles.heading}>방문여부: {isVisited}</Text>
        <Text style={styles.heading}>좋아요: {numLike}</Text>
        <Text style={styles.heading}>카테고리: {category}</Text>

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
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'left',
    paddingHorizontal: 24,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2f2',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  rowText: {
    fontSize: 17,
    color: '#0c0c0c',
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
