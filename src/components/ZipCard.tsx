import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import ImageCarousel from './ImageCarousel';
import colors from '../styles/colors';

interface ZipCardProps {
  name: string;
  stars: number;
  numReview: number;
  address: string;
  distance: number;
  isVisited: boolean;
  category: string;
  onPressZip: () => void;
}

const ZipCard: React.FC<ZipCardProps> = ({
  name,
  stars,
  numReview,
  address,
  distance,
  isVisited,
  category,
  onPressZip,
}) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressZip} style={styles.lowerHalf}>
        <View style={styles.cardHorizontal}>
          <View style={styles.infoContainer}>
            <Text style={styles.mapName}>{name}</Text>
            {/* <Text style={styles.mapAuthor}>평점: {stars}</Text> */}
            {/* <Text style={styles.mapAuthor}>{address}</Text> */}
            <Text style={styles.mapAuthor}>{category}</Text>
            {/* <Text style={styles.followersCount}>리뷰수 {numReview}</Text> */}
            <Text style={styles.mapDistance}>나와의 거리: {distance}</Text>
          </View>
          <Ionicons
            name={
              isVisited
                ? 'radio-button-off-outline'
                : 'checkmark-circle-outline'
            }
            size={30}
            color={colors.coral1}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 3,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    padding: 0,
  },
  infoContainer: {
    flex: 1,
    padding: 1,
  },
  cardHorizontal: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  mapName: {
    fontSize: 18,
    fontWeight: 300,
    marginBottom: 8,
    color: colors.coral1,
  },
  mapAuthor: {
    fontSize: 12,
    marginBottom: 4,
    color: 'black',
  },
  mapDistance: {
    fontSize: 12,
    marginBottom: 8,
    color: 'black',
  },
  followersCount: {
    color: colors.coral1,
    marginBottom: 10,
  },
  lowerHalf: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default ZipCard;
