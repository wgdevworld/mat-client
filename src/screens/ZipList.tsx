/* eslint-disable react-native/no-inline-styles */
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import ZipCard from '../components/ZipCard';
import {ScreenParamList} from '../types/navigation';
import colors from '../styles/colors';
import Header from '../components/Header';
import {calculateDistance} from '../tools/CommonFunc';
import {Coordinate, MatZip} from '../types/store';
import Geolocation from 'react-native-geolocation-service';

export default function ZipList() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const route = useRoute<RouteProp<ScreenParamList, 'ZipList'>>();
  const [orderedMatZips, setOrderedMatZips] = useState<MatZip[]>([]);
  const {map} = route.params;
  const [location, setLocation] = useState<Coordinate | null>(null);
  useEffect(() => {
    setOrderedMatZips(map.zipList);
    try {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation(prevState => ({
            ...prevState,
            latitude: latitude,
            longitude: longitude,
          }));
          setOrderedMatZips((prev: any) => {
            const sortedArray = [...prev].sort(
              (a, b) =>
                calculateDistance(a.coordinate, {
                  latitude: latitude,
                  longitude: longitude,
                }) -
                calculateDistance(b.coordinate, {
                  latitude: latitude,
                  longitude: longitude,
                }),
            );

            return sortedArray;
          });
        },
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 3600,
          maximumAge: 3600,
        },
      );
    } catch (e) {
      console.log(e);
    }
    if (location === null) {
      return;
    }
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              ...styles.heading,
              // maxWidth:
              //   map.authorId === 'ef4a3851-f4f3-4316-93d3-6c5178d23da6'
              //     ? '100%'
              //     : '80%',
            }}>
            {map.name} 🎯
          </Text>
          {/* <View
            style={{
              flexDirection: 'row',
              height: 40,
              width: '15%',
            }}>
            {map.authorId !== 'ef4a3851-f4f3-4316-93d3-6c5178d23da6' && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('UserMain', {
                    userEmail: map.authorEmail!,
                  });
                }}
                style={{
                  alignSelf: 'center',
                  height: '100%',
                  width: '100%',
                  borderRadius: 1000,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={assets.images.default_profile}
                    resizeMethod="auto"
                    style={{
                      borderRadius: 500,
                      width: 30,
                      height: 30,
                      alignSelf: 'center',
                    }}
                  />
                </View>

                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={colors.coral1}
                />
              </TouchableOpacity>
            )}
          </View> */}
        </View>

        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={styles.description}>
            {/* TODO: 이거 이미지 로딩 안됌 */}
            {/* <Image source={{uri: map.imageSrc[0]}} /> */}
            <Text style={{fontWeight: '500', textAlign: 'left'}}>
              {map.description}
            </Text>
          </View>
        </View>

        <View>
          <FlatList
            data={orderedMatZips}
            initialNumToRender={20}
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
    minWidth: '100%',
    // alignItems: 'center',
    padding: 10,
    borderRadius: 9,
    backgroundColor: colors.grey,
    marginBottom: 10,
  },
});
