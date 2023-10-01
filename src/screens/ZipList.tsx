/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import React, {useEffect} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import ZipCard from '../components/ZipCard';
import {ScreenParamList} from '../types/navigation';
import colors from '../styles/colors';


export default function ZipList() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const route = useRoute<RouteProp<ScreenParamList, 'ZipList'>>();
  const mapData = route.params;
  const zipData = [
    {
      id: '1',
      name: '멘야준',
      stars: 5.0,
      numReview: 123,
      //TODO: change to string after completing image upload functionality
      // imageSrc: ImageSourcePropType;,
      address: '서울시 마포구 동교로 123',
      distance: 5,
      isVisited: true,
      category: '일본라멘',
    },
    {
      id: '2',
      name: '라이라이켄',
      stars: 4.9,
      numReview: 312,
      //TODO: change to string after completing image upload functionality
      // imageSrc: ImageSourcePropType;,
      address: '서울시 관악구 라멘로 123',
      distance: 34,
      isVisited: true,
      category: '일본라멘',
    },
    {
      id: '3',
      name: '오오도리',
      stars: 4.6,
      numReview: 64,
      //TODO: change to string after completing image upload functionality
      // imageSrc: ImageSourcePropType;,
      address: '서울시 용산구 라멘로 123',
      distance: 1.2,
      isVisited: false,
      category: '일본라멘',
    },
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>{mapData.map.name} 🎯</Text>
        <View style={styles.description}>
          {/* TODO: 이거 이미지 로딩 안됌 */}
          <Image source={{ uri: mapData.map.imageSrc[0] }}/>
          <Text>{mapData.map.description}</Text>
          </View>
        <View style={{paddingHorizontal: 24}}>
          <FlatList
            data={mapData.map.zipList}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({item}) => (
              <ZipCard
                // id={item.id}
                name={item.name}
                stars={item.reviewAvgRating}
                numReview={item.reviewCount}
                address={item.address}
                distance={item.distance}
                isVisited={item.isVisited}
                category={item.category}
                onPressZip={() => navigation.navigate('MatZip', {zip: item})}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {paddingVertical: 24},
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    marginLeft: 6,
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  description: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 30,
    marginRight: 20,
    padding: 15,
    paddingTop: 30,
    paddingBottom: 30,
    borderRadius: 9,
    backgroundColor: colors.grey,
    marginBottom: 10
  }
});
