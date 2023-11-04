/* eslint-disable react-native/no-inline-styles */
import React from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import ImageCarousel from '../components/ImageCarousel';
// import assets from '../../assets';
import {View, Text, StyleSheet, ScrollView, Image} from 'react-native';
import {Review} from '../types/store';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({review}) => {
  return (
    <View style={styles.container}>
      <Text>
        {review.date.toLocaleDateString('ko-KR') +
          ' ' +
          review.date.toLocaleTimeString('ko-KR')}{' '}
        @{review.author} | 평점: {review.rating}
      </Text>
      <Text style={styles.contentText}>{review.content}</Text>
      {review.images && review.images.length > 0 && (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          key={review.date + review.content}>
          {review.images.map((image: any) => (
            <Image
              key={image.src + image.id}
              style={{
                width: 100,
                height: 100,
                margin: 10,
              }}
              source={{uri: image.src}}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 0,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 0,
    elevation: 2,
    padding: 12,
  },

  contentText: {
    marginTop: 5,
  },
});

export default ReviewCard;
