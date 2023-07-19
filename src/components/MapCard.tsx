import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCarousel from '../components/ImageCarousel';
import assets from '../../assets';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

// TODO: refresh after scroll down from top

interface MapCardProps {
  mapName: string;
  followers: number;
  author: string;
  // move to corresponding map
  onPressMap: () => void;
}

const MapCard: React.FC<MapCardProps> = ({
  mapName,
  followers,
  author,
  onPressMap,
}) => {
  const [addIcon, setAddIcon] = useState(true);

  const handleIconPress = () => {
    setAddIcon(prev => !prev);
    // subscribe/unsubscribe to the map
  };
  const images = [
    assets.images.스시올로지,
    assets.images.야키토리나루토,
    assets.images.월량관,
    // require('../../assets.image1.png'),
    // require('../../assets.image.2'),
    // require('../../assets.image.3'),
  ];
  return (
    // <View onPress={onPressMap}>
    <View>
      <View style={styles.container}>
        <ImageCarousel images={images} />
        <TouchableOpacity onPress={onPressMap} style={styles.lowerHalf}>
          <View style={styles.infoContainer}>
            <Text style={styles.mapName}>{mapName}</Text>
            <Text style={styles.mapAuthor}>by: {author}</Text>
            <Text style={styles.followersCount}>팔로워 {followers}</Text>
          </View>
          <TouchableOpacity onPress={handleIconPress}>
            <Ionicons
              name={addIcon ? 'add-circle-outline' : 'checkmark-circle-outline'}
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
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

export default MapCard;
