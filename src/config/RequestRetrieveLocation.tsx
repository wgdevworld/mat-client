import Geolocation from 'react-native-geolocation-service';
import {Platform} from 'react-native';
import {Dispatch, SetStateAction} from 'react';

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
    SetStateAction<{latitude: number; longitude: number}>
  >,
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
    }
  });
}
