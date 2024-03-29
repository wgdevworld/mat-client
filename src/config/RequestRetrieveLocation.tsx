import Geolocation from 'react-native-geolocation-service';
import {Platform} from 'react-native';
import {Dispatch, RefObject, SetStateAction} from 'react';
import MapView, {Region} from 'react-native-maps';

export async function requestPermission() {
  try {
    if (Platform.OS === 'ios') {
      return await Geolocation.requestAuthorization('always');
    }
  } catch (e) {
    console.log(e);
  }
}

export function requestPermissionAndGetLocation(
  setCurrentLocation: Dispatch<
    SetStateAction<{latitude: number; longitude: number} | null>
  >,
  mapRef: RefObject<MapView>,
) {
  requestPermission().then(result => {
    if (result === 'granted') {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCurrentLocation(prevState => ({
            ...prevState,
            latitude: latitude,
            longitude: longitude,
          }));
          if (!mapRef.current) {
            return;
          }
          const newRegion: Region = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          mapRef.current.animateToRegion(newRegion, 0);
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
    } else {
      if (!mapRef.current) {
        return;
      }
      const newRegion: Region = {
        latitude: 37.566535,
        longitude: 126.977969,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
      mapRef.current.animateToRegion(newRegion, 0);
    }
  });
}
