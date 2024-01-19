import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  stars,
  numReview,
  address,
  distance,
  isVisited,
  category,
  onPressZip,
}) => {
  const categoryEmoji = getCategoryEmoji(category);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressZip} style={styles.lowerHalf}>
        <View style={styles.cardHorizontal}>
          <View style={styles.infoContainer}>
            <Text style={styles.mapName}>
              {categoryEmoji} {name}
            </Text>
            {/* <Text style={styles.mapAuthor}>평점: {stars}</Text> */}
            {/* <Text style={styles.mapAuthor}>{address}</Text> */}
            {/* <Text style={styles.mapAuthor}>{category}</Text> */}
            {/* <Text style={styles.followersCount}>리뷰수 {numReview}</Text> */}
            {/* //TODO: 나와의 거리 넣기 */}
            {/* <Text style={styles.mapDistance}>나와의 거리: {distance}</Text> */}
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
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 3,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
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
    paddingHorizontal: 12,
    paddingTop: 12,
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
});

export default ZipCard;
