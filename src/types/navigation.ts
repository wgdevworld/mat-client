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
  FAQ: undefined;
  Help: undefined;
  SignupEmail: undefined;
  SignupUser: undefined;
  SignupPwd: undefined;
  SignupAddress: undefined;
  Survey1: undefined;
  Survey2: undefined;
  Survey3: undefined;
  Welcome: undefined;
  AccessGrant: undefined;

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
