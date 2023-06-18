/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useMemo, useRef, useState} from 'react';
import 'react-native-gesture-handler';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import colors from './styles/colors';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import assets from '../assets';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function App(): JSX.Element {
  const sheetRef = useRef<BottomSheet>(null);
  const [buttonHeight, setButtonHeight] = useState(0);
  const [buttonOpacity, setButtonOpacity] = useState(1);

  type Item = {
    imageSrc: ImageSourcePropType;
    name: string;
    stars: number;
    numReview: number;
    address: string;
    distance: number;
    isVisited: boolean;
  };

  const data = [
    {
      name: '스시올로지',
      imageSrc: assets.images.스시올로지,
      distance: 50,
      address: '서울특별시 마포구 동교로 266-11',
      stars: 4.8,
      numReview: 22,
      isVisited: false,
    },
    {
      name: '진만두',
      imageSrc: assets.images.진만두,
      distance: 102,
      address: '서울 마포구 와우산로29길 4-42 지하1층',
      stars: 4.7,
      numReview: 35,
      isVisited: false,
    },
    {
      name: '월량관',
      imageSrc: assets.images.월량관,
      distance: 149,
      address: '서울 마포구 동교로46길 10',
      stars: 4.8,
      numReview: 32,
      isVisited: false,
    },
    {
      name: '이안정',
      imageSrc: assets.images.이안정,
      distance: 155,
      address: '서울 마포구 독막로15길 3-3 1층 101호',
      stars: 4.9,
      numReview: 42,
      isVisited: true,
    },
    {
      name: '카와카츠',
      imageSrc: assets.images.카와카츠,
      distance: 203,
      address: '서울 마포구 동교로 126 1층 102호',
      stars: 4.5,
      numReview: 30,
      isVisited: false,
    },
    {
      name: '야키토리 나루토',
      imageSrc: assets.images.야키토리나루토,
      distance: 293,
      address: '서울 마포구 독막로9길 26 야키토리 나루토',
      stars: 4.6,
      numReview: 15,
      isVisited: false,
    },
  ];
  const snapPoints = useMemo(() => ['26%', '40%', '80%'], []);

  const handleSheetChange = useCallback(
    (index: any) => {
      const screenPercent = parseFloat(snapPoints[index]);
      setButtonHeight(screenHeight * screenPercent * 0.01);
      index === 2 ? setButtonOpacity(0) : setButtonOpacity(1);
    },
    [snapPoints],
  );

  const renderItem = useCallback(({item}: {item: Item}) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemImageContainer}>
          <Image source={item.imageSrc} style={styles.itemImage} />
        </View>
        <View style={styles.itemInfoContainer}>
          <View style={styles.itemTitleStarsContainer}>
            <Text style={styles.itemTitleText}>{item.name}</Text>
            {item.isVisited && (
              <Ionicons
                name="checkmark-done-circle-outline"
                size={20}
                color={'white'}
              />
            )}
            <View style={styles.itemStarReviewContainer}>
              <Ionicons name="star" size={14} color={'white'} />
              <Text style={styles.itemStarsText}>{item.stars}</Text>
              <Text style={styles.itemReviewText}>리뷰 {item.numReview}</Text>
            </View>
          </View>
          <Text style={styles.itemSubtext}>{item.address}</Text>
          <Text style={styles.itemSubtext}>나와의 거리 {item.distance}m</Text>
        </View>
      </View>
    );
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.searchTextInputContainer}>
        <GooglePlacesAutocomplete
          minLength={2}
          placeholder="장소를 검색해보세요!"
          textInputProps={{
            placeholderTextColor: 'white',
          }}
          query={{
            key: 'AIzaSyDMSKeetZyFab4VFCpDZZ-jft7ledGM1NI',
            language: 'ko',
            components: 'country:kr',
          }}
          keyboardShouldPersistTaps={'handled'}
          fetchDetails={true}
          onPress={(data, details) => {
            console.log(data, details);
          }}
          onFail={error => console.error(error)}
          onNotFound={() => console.error('검색 결과 없음')}
          keepResultsAfterBlur={true}
          enablePoweredByContainer={false}
          styles={styles.searchTextInput}
        />
      </View>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 37.52358729045865,
            longitude: 126.89696839660834,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        />

        <View style={styles.navBtnContainer}>
          <TouchableOpacity style={styles.navBtn}>
            <Ionicons
              name="map-outline"
              size={screenWidth * 0.08}
              color={colors.coral1}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Ionicons
              name="star-outline"
              size={screenWidth * 0.08}
              color={colors.coral1}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Ionicons
              name="people-outline"
              size={screenWidth * 0.08}
              color={colors.coral1}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Ionicons
              name="person-circle-outline"
              size={screenWidth * 0.08}
              color={colors.coral1}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            ...styles.mapBtn,
            bottom: buttonHeight,
            opacity: buttonOpacity,
          }}>
          <View style={{...styles.mapBtnContainer, marginBottom: 5}}>
            <Ionicons
              name="navigate-outline"
              color={'white'}
              size={25}
              style={{paddingRight: 2}}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.mapBtn,
            bottom: buttonHeight + 50,
            opacity: buttonOpacity,
          }}>
          <View style={styles.mapBtnContainer}>
            <Ionicons
              name="add-outline"
              color={'white'}
              size={35}
              style={{paddingLeft: 2}}
            />
          </View>
        </TouchableOpacity>
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          onChange={handleSheetChange}>
          <BottomSheetFlatList
            data={data}
            keyExtractor={i => i.name}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}
            ListHeaderComponent={
              <Text style={styles.flatListHeaderText}>근처 나의 맛집들</Text>
            }
            ListFooterComponent={<View style={{height: 200}} />}
          />
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: screenHeight * 0.02,
  },
  mapBottomSheetContainer: {
    flex: 1,
  },
  map: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 60,
  },
  navBtnContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    zIndex: 1,
    height: 60,
    width: '100%',
    backgroundColor: 'white',
  },
  navBtn: {
    width: screenWidth / 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTextInputContainer: {
    position: 'absolute',
    top: getStatusBarHeight(),
    zIndex: 1,
    width: '95%',
    height: 300,
    flexDirection: 'row',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  searchTextInput: {
    position: 'absolute',
    textInputContainer: {
      opacity: 0.85,
      borderRadius: 10,
    },
    textInput: {
      backgroundColor: colors.coral1,
      borderRadius: 10,
      color: 'white',
    },
  },
  iconContainer: {
    paddingLeft: 10,
  },
  mapBtn: {
    zIndex: 2,
    position: 'absolute',
    right: '3%',
  },
  mapBtnContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.coral1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    backgroundColor: 'white',
  },
  flatListHeaderText: {
    color: colors.coral1,
    fontSize: 20,
    paddingLeft: 16,
    paddingBottom: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 12,
    marginVertical: 5,
    backgroundColor: colors.coral1,
    borderRadius: 10,
  },
  itemTitleStarsContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemStarReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  itemInfoContainer: {
    flex: 1,
  },
  itemTitleText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    paddingBottom: 5,
  },
  itemStarsText: {
    fontSize: 14,
    color: 'white',
    paddingRight: 10,
    paddingLeft: 3,
  },
  itemReviewText: {
    fontSize: 14,
    color: 'white',
  },
  itemSubtext: {
    color: 'white',
    paddingVertical: 2,
  },
  itemImageContainer: {
    width: 76,
    height: 76,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
});

export default App;
