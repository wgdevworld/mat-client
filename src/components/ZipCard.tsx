/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors';

interface ZipCardProps {
  name: string;
  stars: number;
  numReview: number;
  address: string;
  isVisited: boolean | undefined;
  category: string;
  onPressZip: () => void;
  distance: number | undefined;
}

const getCategoryEmoji = (category: string) => {
  switch (category) {
    case 'D':
    case 'cafe':
    case 'bakery':
      return '🍰'; // 디저트
    case 'K':
      return '🍚'; // 한식
    case 'C':
      return '🥡'; // 중식
    case 'F':
      return '🍕'; // 양식
    case 'M':
      return '🥩'; // 고기
    case 'J':
      return '🍣'; // 일식
    case 'I':
      return '🥘'; // 인도식
    case 'B':
    case 'bar':
      return '🍻'; // 주점
    default:
      return '🍴'; // 그 외
  }
};

const ZipCard: React.FC<ZipCardProps> = ({
  name,
  isVisited,
  category,
  onPressZip,
  distance,
}) => {
  const categoryEmoji = getCategoryEmoji(category);
  const distanceDisplay = distance
    ? distance > 1000
      ? `${(distance / 1000).toFixed(1)}km`
      : `${distance}m`
    : undefined;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressZip} style={styles.lowerHalf}>
        <View style={styles.cardHorizontal}>
          <Text
            style={{...styles.mapName, paddingRight: 5}}
            ellipsizeMode="tail">
            {categoryEmoji}
          </Text>
          <View style={styles.infoContainer}>
            <Text style={styles.mapName} ellipsizeMode="tail">
              {name}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '300',
                color: 'black',
                paddingTop: 5,
              }}
              ellipsizeMode="tail">
              나외의 거리: {distanceDisplay ? distanceDisplay : '--'}
            </Text>
          </View>
          <Ionicons
            name={
              isVisited ? 'checkmark-circle-outline' : 'chevron-forward-outline'
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
    justifyContent: 'center',
    backgroundColor: colors.grey,
    marginBottom: 8,
    borderRadius: 12,
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
    fontWeight: '300',
    color: 'black',
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
    padding: 8,
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default ZipCard;
