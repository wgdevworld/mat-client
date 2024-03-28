/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import colors from '../styles/colors';
import {addUserFollower} from '../controls/MatMapControl';
import {useDispatch} from 'react-redux';
import {addFollowingMatMapAction} from '../store/modules/userMaps';
import {MatMap} from '../types/store';
import {
  updateIsJustFollowed,
  updateIsLoadingAction,
} from '../store/modules/globalComponent';
import {useAppSelector} from '../store/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {addPublicMapFollowerCountAction} from '../store/modules/publicMaps';
import FastImage from 'react-native-fast-image';

interface MapCardProps {
  map: MatMap;
  onPressMap: () => void;
  paddingHorizontal?: number;
  backgroundColor?: string;
  heightWidth?: number;
}

const MapCard: React.FC<MapCardProps> = ({
  map,
  onPressMap,
  paddingHorizontal,
  backgroundColor,
  heightWidth,
}) => {
  const dispatch = useDispatch();
  const userFollowingMaps = useAppSelector(
    state => state.userMaps.followingMaps,
  );
  const user = useAppSelector(state => state.user);

  return (
    <TouchableOpacity
      onPress={onPressMap}
      style={{
        paddingHorizontal: paddingHorizontal ? paddingHorizontal : 24,
        backgroundColor: backgroundColor ? backgroundColor : 'white',
      }}>
      <View
        style={{
          ...styles.cardContainer,
        }}>
        <FastImage
          source={{uri: map.imageSrc[0]}}
          style={{
            ...styles.image,
            width: heightWidth ? heightWidth : 150,
            height: heightWidth ? heightWidth : 150,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 5,
            left: 5,
            borderRadius: 8,
            padding: 1,
            backgroundColor: colors.coral1,
          }}>
          <Text
            style={{
              fontSize: 12,
              color: 'white',
              alignSelf: 'center',
              // backgroundColor: colors.coral1,
              padding: 3,
            }}>
            팔로워: {map.numFollower}
          </Text>
        </View>

        <View
          style={{
            ...styles.cardContent,
            backgroundColor: backgroundColor ? backgroundColor : 'white',
            height: heightWidth ? heightWidth : 150,
            paddingBottom: heightWidth ? 0 : 10,
            paddingRight: heightWidth ? 0 : 12,
          }}>
          <View>
            <Text style={styles.mapName}>{map.name}</Text>
            <Text style={styles.mapAuthor}>by {map.author.split('$')[0]}</Text>
          </View>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => {
              // console.log(map.id);
              if (map.authorId && map.authorId === user.id) {
                Alert.alert('본인 지도입니다!');
              } else if (
                userFollowingMaps.find(
                  followingMap => followingMap.id === map.id,
                )
              ) {
                Alert.alert('이미 팔로우하신 지도입니다!');
              } else {
                dispatch(updateIsLoadingAction(true));
                dispatch(updateIsJustFollowed(true));
                addUserFollower(map.id)
                  .then(() => {
                    dispatch(addFollowingMatMapAction(map));
                    dispatch(addPublicMapFollowerCountAction(map.id));
                  })
                  .catch(error => {
                    console.error('Error adding follower:', error);
                  })
                  .finally(() => {
                    dispatch(updateIsLoadingAction(false));
                  });
              }
            }}>
            <Ionicons
              name="people"
              color={'white'}
              size={15}
              style={{alignSelf: 'center'}}
            />
            <Text style={styles.buttonTitle}>팔로우</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    borderColor: colors.grey,
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
    height: 35,
    padding: 10,
    // paddingRight: 14,
    // marginTop: 45,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    borderRadius: 20,
  },
  buttonTitle: {
    fontSize: 12,
    alignSelf: 'center',
    color: 'white',
    paddingLeft: 4,
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
    alignSelf: 'flex-end',
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
