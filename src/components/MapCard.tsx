import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface MapCardProps {
  mapName: string;
  followers: number;
  author: string;
  //   subscribe to map when pressed
  onPressPlus: () => void;
}
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const MapCard: React.FC<MapCardProps> = ({
  mapName,
  followers,
  author,
  onPressPlus,
}) => {
  return (
    <TouchableOpacity onPress={onPressPlus}>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.mapName}>{mapName}</Text>
          <Text style={styles.mapAuthor}>by: {author}</Text>
          <Text style={styles.followersCount}>팔로워 {followers}</Text>
        </View>
        <TouchableOpacity onPress={onPressPlus}>
          <Ionicons name="add-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF4000',
    padding: 80,
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
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
});

export default MapCard;
