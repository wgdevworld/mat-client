import {ImageSourcePropType} from 'react-native';

export interface Zip {
  id: string;
  name: string;
  stars: number;
  numReview: number;
  //TODO: change to string after completing image upload functionality
  imageSrc: ImageSourcePropType;
  address: string;
  distance: number;
  isVisited: boolean;
}
