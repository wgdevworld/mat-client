import {Coordinate, Review} from '../types/store';
import Geocoder from 'react-native-geocoding';

export const changeStringToJSON = (data: any) => {
  let result = data;
  while (1) {
    if (typeof result === 'string') {
      result = JSON.parse(data);
    } else {
      return result;
    }
  }
};

export function calculateDistance(
  coor1: Coordinate,
  coor2: Coordinate,
): number {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(coor2.latitude - coor1.latitude);
  const dLon = toRadians(coor2.longitude - coor1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coor1.latitude)) *
      Math.cos(toRadians(coor2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c * 1000; // Distance in meters
  return Math.round(distance);
}

export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function ratingAverage(array?: Review[]) {
  if (!array || array.length === 0) {
    return 0;
  }
  const sum = array.reduce((acc, value) => acc + value.rating, 0);
  const average = sum / array.length;
  const multiplier = Math.pow(10, 2);
  const roundedAverage = Math.round(average * multiplier) / multiplier;
  return roundedAverage;
}

export async function addressToCoordinate(
  address: string,
): Promise<Coordinate> {
  let result: Coordinate = {
    latitude: 0,
    longitude: 0,
  };
  try {
    console.warn('⛔️ Using Geocoder to retrieve coordinates');
    await Geocoder.from(address)
      .then(json => {
        const location = json.results[0].geometry.location;
        result = {
          latitude: location.lat,
          longitude: location.lng,
        };
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.log(error);
  }
  return result;
}

export function trimCountry(address: string): string {
  const country = address.split(' ')[0];
  const newAddress = address.replace(country, '').trimStart();
  return newAddress;
}
