import {MatMap, MatZip} from './store';

export type ScreenParamList = RootStackParamList;

export type RootStackParamList = {
  AppleLoginTest: undefined;
  SplashScreen: undefined;
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
  MatZipMain: {
    // zipID: string;
    zip: MatZip;
  };
};

export type BottomTabParamList = {
  MapMain: undefined;
  SettingsMain: undefined;
  ListMaps: undefined;
};
