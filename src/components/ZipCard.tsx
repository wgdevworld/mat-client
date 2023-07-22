import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import {Zip} from '../types/store';
import ImageCarousel from './ImageCarousel';

const ZipCard: React.FC<Zip> = ({
  id,
  name,
  stars,
  numReview,
  address,
  distance,
  isVisited,
  category,
  onPressZip,
}) => {
  // Dummy image data here
  const images = [
    assets.images.스시올로지,
    assets.images.야키토리나루토,
    assets.images.월량관,
  ];
  return (
    <View style={styles.container}>
      <ImageCarousel images={images} />
      <TouchableOpacity onPress={onPressZip} style={styles.lowerHalf}>
        <View style={styles.cardHorizontal}>
          <View style={styles.infoContainer}>
            <Text style={styles.mapName}>{name}</Text>
            <Text style={styles.mapAuthor}>Rating: {stars}</Text>
            <Text style={styles.mapAuthor}>{address}</Text>
            <Text style={styles.followersCount}>Reviews {numReview}</Text>
            <Text style={styles.followersCount}>Distance: {distance}</Text>
          </View>
          <Ionicons
            name={
              isVisited
                ? 'radio-button-off-outline'
                : 'checkmark-circle-outline'
            }
            size={30}
            color="white"
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
    backgroundColor: '#FF4000',
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  cardHorizontal: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  mapName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  mapAuthor: {
    fontSize: 12,
    marginBottom: 5,
    color: 'white',
  },
  followersCount: {
    color: 'white',
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
