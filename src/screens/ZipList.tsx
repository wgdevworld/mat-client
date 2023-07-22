/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import ZipCard from '../components/ZipCard';
import {ScreenParamList} from '../types/navigation';

export default function ZipList() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const route = useRoute<RouteProp<ScreenParamList, 'ZipList'>>();
  const mapData = route.params;
  const zipData = [
    {
      id: '1',
      name: '멘야준',
      stars: 5,
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
        <Text style={styles.heading}>{mapData.map.name}</Text>
        <View style={{paddingHorizontal: 24}}>
          <FlatList
            data={zipData}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <ZipCard
                // id={item.id}
                name={item.name}
                stars={item.stars}
                numReview={item.numReview}
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
    textAlign: 'left',
    paddingHorizontal: 24,
  },
});
