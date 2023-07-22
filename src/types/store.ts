import {ImageSourcePropType} from 'react-native';

export interface Zip {
  id: string;
  name: string;
  stars: number;
  numReview: number;
  //TODO: change to string after completing image upload functionality
  //TODO: imageSrc --> there could be multiple images
  // imageSrc: ImageSourcePropType[];
  address: string;
  distance: number;
  isVisited: boolean;
  category: string;
  //TODO: to MatZip page using zipId
}

export interface MatMap {
  id: string;
  name: string;
  author: string;
  numFollower: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface ZipList {
  name: string;
  zipList: Zip[];
}
