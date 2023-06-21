import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors';

type Props = {
  name: string;
  address: string;
  numReview: number;
  rating: number;
};

const PlaceInfoMapCard = (props: Props) => {
  const {name, numReview, rating} = props;
  return (
    <View style={styles.container}>
      <View style={styles.nameRatingContainer}>
        <Text style={styles.nameText}>{name}</Text>
        <View style={styles.ratingReviewContainer}>
          <Ionicons name="star" size={10} color={'white'} />
          <Text style={styles.ratingText}>{rating}</Text>
          <Text style={styles.reviewText}>리뷰 {numReview}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    padding: 10,
    marginBottom: 5,
    backgroundColor: colors.coral1,
    borderRadius: 5,
  },
  nameRatingContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  ratingReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    paddingBottom: 5,
  },
  ratingText: {
    fontSize: 10,
    color: 'white',
    paddingRight: 10,
    paddingLeft: 3,
  },
  reviewText: {
    fontSize: 10,
    color: 'white',
  },
});

export default PlaceInfoMapCard;
