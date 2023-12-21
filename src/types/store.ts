export interface MatZip {
  id: string;
  name: string;
  imageSrc: string[];
  coordinate: Coordinate;
  address: string;
  distance?: number;
  isVisited?: boolean;
  category: string;
  reviewAvgRating: number;
  reviewCount: number;
  description?: string;
  notificationSent?: boolean;
}

//TODO: 스플래시에서 데이터 받아오면 옵셔널 뺴기
export interface MatMap {
  id: string;
  name: string;
  description: string;
  author: string;
  authorId: string;
  publicStatus: boolean;
  imageSrc: string[];
  areaCode: string;
  zipList: MatZip[];
  followerList?: User[];
  numFollower?: number;
}

export interface MuckitItem {
  id: string;
  title: string;
  description: string;
  completeStatus: boolean;
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

export interface Event {
  taskId: string;
  timestamp: string;
}

export interface GlobalComponent {
  isLoading: boolean;
}
