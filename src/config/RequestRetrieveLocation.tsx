import Geolocation from 'react-native-geolocation-service';
import {Platform} from 'react-native';

export async function requestPermission() {
  try {
    if (Platform.OS === 'ios') {
      return await Geolocation.requestAuthorization('always');
    }
  } catch (e) {
    console.log(e);
  }
}

export function requestPermissionAndGetLocation() {
  requestPermission().then(result => {
    if (result === 'granted') {
      Geolocation.getCurrentPosition(
        pos => {
          console.log(pos);
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
