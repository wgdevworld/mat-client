import {ImageSourcePropType} from 'react-native';

export interface MatZip {
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
  // creator: User;
  numFollower: number;
  publicStatus: boolean;
  // images
  areaCode: string;
  zipList: MatZip[];
  followerList: User[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  institution: string;
  createdAt: Date;
  address: string;
  followingMaps: MatMap[];
  deviceToken: string;
  pushAllowStatus: Boolean;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

// export interface ZipList {
//   name: string;
//   zipList: MatZip[];
// }

export interface Review {
  author: string;
  rating: number;
  content: string;
  date: Date;
}
