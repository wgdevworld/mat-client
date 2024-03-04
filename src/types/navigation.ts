import {MatMap} from './store';

export type ScreenParamList = RootStackParamList;

export type RootStackParamList = {
  SplashScreen: undefined;
  TabNavContainer: {
    screen: string;
  };
  LoginMain: undefined;
  SettingsMain: undefined;
  EmailRegisterMain: undefined;
  FAQ: undefined;
  Help: undefined;
  Muckiters: undefined;
  SignupEmail: undefined;
  SignupUser: undefined;
  SignupPwd: undefined;
  SignupAddress: undefined;
  Survey1: undefined;
  Survey2: undefined;
  Survey3: undefined;
  Welcome: undefined;
  AccessGrant: undefined;
  VisitedZips: undefined;

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
    zipID: string | undefined;
  };
};

export type BottomTabParamList = {
  MapMain: undefined;
  SettingsMain: undefined;
  ListMaps: undefined;
};
