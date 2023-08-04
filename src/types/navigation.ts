import {MatMap, MatZip} from './store';

export type ScreenParamList = RootStackParamList;

export type RootStackParamList = {
  TabNavContainer: {
    screen: string;
  };
  LoginMain: undefined;
  SettingsMain: undefined;
  EmailRegisterMain: undefined;

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
    zip: MatZip;
  };
};

export type BottomTabParamList = {
  MapMain: undefined;
  SettingsMain: undefined;
  ListMaps: undefined;
};
