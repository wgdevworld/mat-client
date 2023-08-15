/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import ZipCard from '../components/ZipCard';
import {zips} from '../controls/MatZipControl';
import {ScreenParamList} from '../types/navigation';
import colors from '../styles/colors';

export default function ZipList() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const route = useRoute<RouteProp<ScreenParamList, 'ZipList'>>();
  const mapData = route.params;

  // const zips = async (zipId: string) => {
  //   try {
  //     const query = `{
  //     fetchZip(id: "${zipId}") {
  //       name
  //       address
  //       reviewCount
  //       parentMap {
  //         name
  //       }
  //     }
  //   }`;

  //     const url = `https://muckit-server.site/graphql?query=${query}`;

  //     const response = await axios.get(url, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     console.log(response.data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const zipData = zips('0923');
  // const testZips = zips('0923');
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
        <Text style={styles.heading}>{mapData.map.name} 👀</Text>
        <View style={styles.description}>
          <Text>
            2022년 4월부터 방영 중인 풍자의 맛집 탐방 콘텐츠! '또간집'이라는
            프로그램명부터 알 수 있듯 여러 번 간 맛집을 찾아다니는 게 콘셉트다.
          </Text>
        </View>
        <View style={{paddingHorizontal: 24}}>
          <FlatList
            data={zipData}
            keyExtractor={item => item.id}
            scrollEnabled={false}
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
    marginBottom: 10,
  },
});
