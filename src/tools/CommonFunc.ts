import {Coordinate} from '../types/store';

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
      Math.cos(toRadians(coor2.longitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c * 1000; // Distance in meters
  return Math.round(distance);
}

export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
