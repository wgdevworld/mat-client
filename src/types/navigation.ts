import {MatMap, Zip} from './store';

export type ScreenParamList = RootStackParamList;

export type RootStackParamList = {
  TabNavContainer: {
    screen: string;
  };
  LoginMain: undefined;
  SettingsMain: undefined;

  //BottomTab
  MapMain: undefined;
  ProfileMain: undefined;
  ListMaps: undefined;

  // MatMap, MatZip
  ZipList: {
    // mapID: string;
    map: MatMap;
  };
  MatZip: {
    // zipID: string;
    zip: Zip;
  };
};

export type BottomTabParamList = {
  MapMain: undefined;
  ProfileMain: undefined;
  ListMaps: undefined;
};
