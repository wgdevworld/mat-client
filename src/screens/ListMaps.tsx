/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import MapCard from '../components/MapCard';

export default function ListMaps() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const mapData = [
    {
      id: '1',
      name: '라멘여지도',
      numFollower: 342,
      author: '홍길동',
    },
    {
      id: '2',
      name: '또간집',
      numFollower: 10230,
      author: '윤지원',
    },
    {
      id: '3',
      name: '비밀이야',
      numFollower: 210000,
      author: '운영진',
    },
  ];
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={styles.containter}>
        <Text style={styles.heading}>지도 모음집</Text>
        <View style={{paddingHorizontal: 24}}>
          <FlatList
            data={mapData}
            keyExtractor={item => item.name}
            scrollEnabled={false}
            renderItem={({item}) => (
              <MapCard
                mapName={item.name}
                followers={item.numFollower}
                author={item.author}
                onPressMap={() => navigation.navigate('ZipList', {map: item})}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containter: {
    paddingVertical: 24,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  map: {
    height: 100,
    backgroundColor: '#FF4000',
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  mapName: {
    fontSize: 19,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  mapText: {
    marginTop: 5,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});
