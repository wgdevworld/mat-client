/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors';
import {MatZip} from '../types/store';
type Props = {
  marker: MatZip;
};

const PlaceInfoMapCard = (props: Props) => {
  const {marker} = props;
  const averageRating = marker.reviewAvgRating;
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.nameRatingContainer}>
        <Text style={styles.nameText}>{marker.name}</Text>
        <View style={styles.ratingReviewContainer}>
          <View style={{flexDirection: 'row'}}>
            <Ionicons name="star" size={10} color={'white'} />
            <Text style={styles.ratingText}>{averageRating}</Text>
          </View>
          <Text style={styles.reviewText}>리뷰 {marker.reviewCount} 개</Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward-outline"
        color={colors.white}
        style={{alignSelf: 'center', paddingLeft: 5}}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    padding: 10,
    paddingRight: 5,
    marginBottom: 5,
    backgroundColor: colors.coral1,
    borderRadius: 5,
  },
  closeCard: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  nameRatingContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  ratingReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
