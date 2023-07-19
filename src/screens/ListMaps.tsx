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
  const handlePressMap = () => {
    // Implement the functionality to add a follower here
    navigation.navigate('MatZip');
    console.log('Map pressed');
  };
  const mapData = [
    {
      mapName: '라멘여지도',
      followers: 342,
      author: '홍길동',
      onPressMap: handlePressMap,
    },
    {
      mapName: '또간집',
      followers: 10230,
      author: '윤지원',
      onPressMap: handlePressMap,
    },
    {
      mapName: '비밀이야',
      followers: 210000,
      author: '운영진',
      onPressMap: handlePressMap,
    },
  ];
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={styles.containter}>
        <Text style={styles.heading}>지도 모음집</Text>
        <View style={{paddingHorizontal: 24}}>
          <FlatList
            data={mapData}
            keyExtractor={item => item.mapName}
            renderItem={({item}) => (
              <MapCard
                mapName={item.mapName}
                followers={item.followers}
                author={item.author}
                onPressMap={item.onPressMap}
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
