import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Button} from 'react-native-elements'; // Import the Button component
import colors from '../styles/colors';
import {addUserFollower} from '../controls/MatMapControl';
import {useDispatch} from 'react-redux';
import {addFollowingMatMapAction} from '../store/modules/userMaps';
import {MatMap} from '../types/store';
import {updateIsLoadingAction} from '../store/modules/globalComponent';

interface MapCardProps {
  map: MatMap;
  onPressMap: () => void;
}

const MapCard: React.FC<MapCardProps> = ({map, onPressMap}) => {
  const dispatch = useDispatch();
  const [addIcon, setAddIcon] = useState(true);

  return (
    <TouchableOpacity onPress={onPressMap}>
      <View style={styles.cardContainer}>
        <Image source={{uri: map.imageSrc[0]}} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.mapName}>{map.name}</Text>
          <Text style={styles.mapAuthor}>by: {map.author}</Text>
          <Text style={styles.mapFollowers}>
            팔로워 {map.numFollower} | 유튜브
          </Text>
          <Button
            icon={{
              name: 'bell',
              type: 'font-awesome',
              color: 'white',
              size: 15,
            }}
            title="알림 받기"
            buttonStyle={styles.bellButton}
            titleStyle={styles.buttonTitle} // Adjust the font size here
            onPress={() => {
              dispatch(updateIsLoadingAction(true));
              addUserFollower(map.id);
              dispatch(addFollowingMatMapAction(map));
              dispatch(updateIsLoadingAction(false));
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
  },
  cardContent: {
    flex: 1,
    borderColor: colors.grey,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 14,
    height: 150,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  bellButton: {
    backgroundColor: colors.coral1,
    padding: 10,
    height: 35,
    width: 94,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 45,
    marginLeft: 70,
    borderRadius: 20,
  },
  buttonTitle: {
    fontSize: 12,
  },
  mapName: {
    fontSize: 18,
    marginTop: 8,
    marginBottom: 5,
    color: 'black',
    fontWeight: '600',
  },
  mapAuthor: {
    fontSize: 10,
    marginBottom: 2,
    color: 'black',
  },
  mapFollowers: {
    fontSize: 10,
    color: 'black',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderColor: colors.grey,
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});

export default MapCard;
