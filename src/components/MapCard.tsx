import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCarousel from '../components/ImageCarousel';
import assets from '../../assets';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../styles/colors';

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
    setAddIcon((prev) => !prev);
    // subscribe/unsubscribe to the map
    // communicate with backend
  };

  const images = [assets.images.default_map];

  return (
    <View>
      <ImageCarousel images={images} />
      <TouchableOpacity onPress={onPressMap}>
        <View style={styles.overlay}>
          <View>
            <Text style={styles.mapNameOverlay}>{mapName}</Text>
            <Text style={styles.mapAuthorOverlay}>by: {author} | 팔로워 {followers} | 유튜브 </Text>
          </View>
          
          <TouchableOpacity onPress={handleIconPress} style={styles.addButton}>
            <Ionicons
              name={addIcon ? 'add-circle-outline' : 'checkmark-circle-outline'}
              size={35}
              color={colors.coral1}
            />
          </TouchableOpacity>
        </View>
        
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 15,
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  addButton: {
    marginLeft: 'auto'
  },
  mapNameOverlay: {
    fontSize: 20,
    marginBottom: 5,
    color: 'black',
    fontWeight: 600
  },
  mapAuthorOverlay: {
    fontSize: 12,
    marginBottom: 2,
    color: 'black',
  },
});

export default MapCard;
