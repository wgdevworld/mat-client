/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
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

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import assets from '../../assets';
import colors from '../styles/colors';
import {requestPermissionAndGetLocation} from '../config/RequestRetrieveLocation';
import PlaceInfoMapCard from '../components/PlaceInfoMapCard';
import {calculateDistance} from '../tools/CommonFunc';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

type Coordinate = {
  latitude: number;
  longitude: number;
};

type Place = {
  name: string;
  address: string;
  rating: number;
  numReview: number;
  coordinate: Coordinate;
};

//TODO: Item 없애고 Zip으로 변경/통합
type Item = {
  imageSrc: ImageSourcePropType;
  name: string;
  stars: number;
  numReview: number;
  address: string;
  distance: number;
  isVisited: boolean;
};

//FIXME: Don't let this be a global variable and figure out how to read in from marker component
let newCard: Item = {
  imageSrc: assets.images.스시올로지,
  name: 'Default name',
  stars: 0,
  numReview: 0,
  address: 'Default address',
  distance: 0,
  isVisited: false,
};

function App(): JSX.Element {
  //TODO: read in from database + save in redux store
  const [data, setData] = useState([
    {
      name: '달버터',
      imageSrc: assets.images.달버터2,
      distance: 50,
      address: '서울특별시 마포구 동교로 266-11',
      stars: 4.8,
      numReview: 22,
      isVisited: false,
      coordinates: {
        latitude: 37.5629026,
        longitude: 126.925946,
      },
    },
    {
      name: '진만두',
      imageSrc: assets.images.교래퐁낭1,
      distance: 102,
      address: '서울 마포구 와우산로29길 4-42 지하1층',
      stars: 4.7,
      numReview: 35,
      isVisited: false,
      coordinates: {
        latitude: 37.5551921,
        longitude: 126.929247,
      },
    },
    {
      name: '월량관',
      imageSrc: assets.images.산방산국수맛집1,
      distance: 149,
      address: '서울 마포구 동교로46길 10',
      stars: 4.8,
      numReview: 32,
      isVisited: false,
      coordinates: {
        latitude: 37.5625237,
        longitude: 126.925267,
      },
    },
    {
      name: '이안정',
      imageSrc: assets.images.달버터3,
      distance: 155,
      address: '서울 마포구 독막로15길 3-3 1층 101호',
      stars: 4.9,
      numReview: 42,
      isVisited: true,
      coordinates: {
        latitude: 37.5480964,
        longitude: 126.921626,
      },
    },
    {
      name: '카와카츠',
      imageSrc: assets.images.교래퐁낭2,
      distance: 203,
      address: '서울 마포구 동교로 126 1층 102호',
      stars: 4.5,
      numReview: 30,
      isVisited: false,
      coordinates: {
        latitude: 37.5547239,
        longitude: 126.916187,
      },
    },
    {
      name: '야키토리 나루토',
      imageSrc: assets.images.교래퐁낭3,
      distance: 293,
      address: '서울 마포구 독막로9길 26',
      stars: 4.6,
      numReview: 15,
      isVisited: false,
      coordinates: {
        latitude: 37.5493388,
        longitude: 126.920199,
      },
    },
  ]);
  const sheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  const [buttonHeight, setButtonHeight] = useState(0);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [markers, setMarkers] = useState<Place[]>([]);
  const [cards, setCards] = useState<Item[]>(data);

  //TODO: 리덕스에다 저장
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    console.log(currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    setCards(data);
  }, [data]);

  useEffect(() => {
    const newRegion = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(newRegion, 1000);
  }, [currentLocation]);

  useEffect(() => {
    setData(prevData => {
      const updatedData = prevData.map(item => {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          item.coordinates.latitude,
          item.coordinates.longitude,
        );
        return {...item, distance};
      });
      updatedData.sort((a, b) => a.distance - b.distance);
      return updatedData;
    });
    console.log(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLocation]);

  const onPressSearchResult = (details: any) => {
    const location = details.geometry.location;
    const newMarker = {
      name: details.name,
      address: details.formatted_address,
      rating: 5,
      numReview: 5,
      coordinate: {
        latitude: location.lat,
        longitude: location.lng,
      },
    };
    setMarkers(prevMarkers => [...prevMarkers, newMarker]);
    mapRef.current?.animateToRegion(
      {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000,
    );
    newCard = {
      name: details.name,
      imageSrc: assets.images.스시올로지,
      stars: 4.8,
      numReview: 22,
      address: details.formatted_address,
      distance: 50,
      isVisited: false,
    };
  };

  const snapPoints = useMemo(() => ['26%', '40%', '80%'], []);

  const handleSheetChange = useCallback(
    (index: any) => {
      const screenPercent = parseFloat(snapPoints[index]);
      setButtonHeight(screenHeight * screenPercent * 0.01);
      index === 2 ? setButtonOpacity(0) : setButtonOpacity(1);
    },
    [snapPoints],
  );

  const onPressAddBtn = () => {
    setCards(prevCards => [...prevCards, newCard]);
  };

  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();

  const renderItem = useCallback(
    ({item}: {item: Item}) => {
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => navigation.navigate('MatZip', {zip: item})}>
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
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  return (
    <View style={{flex: 1}}>
      <GestureHandlerRootView style={{flex: 1}}>
        <View style={styles.searchTextInputContainer}>
          <GooglePlacesAutocomplete
            minLength={2}
            placeholder="장소를 검색해보세요!"
            textInputProps={{
              placeholderTextColor: 'black',
            }}
            query={{
              key: 'AIzaSyDMSKeetZyFab4VFCpDZZ-jft7ledGM1NI',
              language: 'ko',
              components: 'country:kr',
            }}
            keyboardShouldPersistTaps={'handled'}
            fetchDetails={true}
            onPress={details => {
              onPressSearchResult(details);
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
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: currentLocation ? currentLocation.latitude : 37.5571888,
              longitude: currentLocation
                ? currentLocation.longitude
                : 126.923643,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            {markers.map((place, index) => (
              <Marker key={index} coordinate={place.coordinate}>
                <View style={styles.markerContentContainer}>
                  <PlaceInfoMapCard
                    name={place.name}
                    address={place.address}
                    numReview={place.numReview}
                    rating={place.rating}
                  />
                  <Ionicons name="location" size={35} color={colors.coral1} />
                </View>
              </Marker>
            ))}
            {currentLocation && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="현재 위치">
                <View style={styles.selfMarkerContainer}>
                  <Ionicons
                    name="radio-button-on-outline"
                    size={15}
                    color={colors.coral1}
                  />
                </View>
              </Marker>
            )}
          </MapView>

          {/* <View style={styles.navBtnContainer}>
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
        </View> */}
          <TouchableOpacity
            style={{
              ...styles.mapBtn,
              bottom: buttonHeight,
              opacity: buttonOpacity,
            }}
            onPress={() => {
              requestPermissionAndGetLocation(setCurrentLocation);
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
            }}
            onPress={onPressAddBtn}>
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
              data={cards}
              keyExtractor={i => i.name}
              renderItem={renderItem}
              contentContainerStyle={styles.contentContainer}
              ListHeaderComponent={
                <Text style={styles.flatListHeaderText}>근처 나의 맛집들 🍶</Text>
              }
              ListFooterComponent={<View style={{height: 200}} />}
            />
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  markerContentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selfMarkerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  searchTextInput: {
    position: 'absolute',
    textInputContainer: {
      opacity: 0.7,
      borderRadius: 10,
    },
    textInput: {
      backgroundColor: 'white',
      borderRadius: 10,
      color: 'black',
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
