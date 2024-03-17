/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import ZipCard from '../components/ZipCard';
import {ScreenParamList} from '../types/navigation';
import colors from '../styles/colors';
import Header from '../components/Header';
import {calculateDistance} from '../tools/CommonFunc';
import {MatZip} from '../types/store';

export default function ZipList() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const route = useRoute<RouteProp<ScreenParamList, 'ZipList'>>();
  const [orderedMatZips, setOrderedMatZips] = useState<MatZip[]>([]);
  const {map, location} = route.params;

  useEffect(() => {
    setOrderedMatZips(map.zipList);
    if (location === null) {
      return;
    }
    setOrderedMatZips((prev: any) => {
      const sortedArray = [...prev].sort(
        (a, b) =>
          calculateDistance(a.coordinate, location) -
          calculateDistance(b.coordinate, location),
      );

      return sortedArray;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Header
        onPressBack={() => navigation.goBack()}
        color={colors.white}
        buttonColor={colors.coral1}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>{map.name} 🎯</Text>
        <View style={styles.description}>
          {/* TODO: 이거 이미지 로딩 안됌 */}
          <Image source={{uri: map.imageSrc[0]}} />
          <Text style={{fontWeight: '500'}}>{map.description}</Text>
        </View>
        <View>
          <FlatList
            data={orderedMatZips}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            renderItem={({item}) => (
              <ZipCard
                name={item.name}
                stars={item.reviewAvgRating}
                numReview={item.reviewCount}
                distance={
                  location
                    ? calculateDistance(item.coordinate, location)
                    : undefined
                }
                address={item.address}
                isVisited={item.isVisited}
                category={item.category}
                onPressZip={() => {
                  console.log(item.id);
                  navigation.navigate('MatZipMain', {zipID: item.id});
                }}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {paddingBottom: 24, paddingHorizontal: 24},
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    marginLeft: 6,
    textAlign: 'left',
  },
  description: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 9,
    backgroundColor: colors.grey,
    marginBottom: 10,
  },
});
