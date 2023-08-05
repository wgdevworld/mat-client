import React from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import ImageCarousel from '../components/ImageCarousel';
// import assets from '../../assets';
import {View, Text, StyleSheet} from 'react-native';

// TODO: refresh after scroll down from top

interface ReviewCardProps {
  author: string;
  rating: number;
  content: string;
  date: Date;
  //   images: Image[];
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  author,
  rating,
  content,
  date,
  //   images,
}) => {
  // const images = [
  //   assets.images.스시올로지,
  //   assets.images.야키토리나루토,
  //   assets.images.월량관,
  // ];
  return (
    <View style={styles.container}>
      <Text>
        {date.toLocaleDateString('ko-KR')} @{author} | 평점: {rating}
      </Text>
      <Text style={styles.contentText}>{content}</Text>

      {/* <ImageCarousel images={images} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#f2f2f2f2',
    borderRadius: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    padding: 12,
  },

  contentText: {
    marginTop: 5,
  },
});

export default ReviewCard;
