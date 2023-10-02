export interface MatZip {
  id: string;
  name: string;
  reviews?: Review[];
  imageSrc: string[];
  coordinate: Coordinate;
  address: string;
  distance?: number;
  isVisited?: boolean;
  category: string;
  reviewAvgRating?: number;
  reviewCount?: number;
  //TODO: to MatZip page using zipId
}

//TODO: 스플래시에서 데이터 받아오면 옵셔널 뺴기
export interface MatMap {
  id: string;
  name: string;
  description: string;
  creatorName: string;
  publicStatus: boolean;
  // images
  areaCode: string;
  zipList: MatZip[];
  followerList?: User[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  address: string;
  deviceToken: string;
  pushAllowStatus: Boolean;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Review {
  author: string;
  rating: number;
  content: string;
  date: Date;
  images?: string[];
}

export interface MatZipPayload {
  id: string;
  matZip: MatZip;
}
