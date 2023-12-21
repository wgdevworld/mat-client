import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ScreenParamList} from './types/navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import store from './store/store';
import {PersistGate} from 'redux-persist/integration/react';
import SettingsMain from './screens/SettingsMain';
import LoginMain from './screens/LoginMain';
import FAQ from './screens/FAQ';
import Help from './screens/Help';
import TabNavContainer from './screens/TabNavContainer';
import MatZipMain from './screens/MatZipMain';
import ListMaps from './screens/ListMaps';
import messaging from '@react-native-firebase/messaging';
import {onDisplayNotification} from './controls/NotificationControl';
import EmailRegisterMain from './screens/EmailRegisterMain';
import ZipList from './screens/ZipList';
import ProfileMain from './screens/ProfileMain';
import Welcome from './screens/Onboarding/Welcome';
import Survey1 from './screens/Onboarding/Survey1';
import Survey2 from './screens/Onboarding/Survey2';
import Survey3 from './screens/Onboarding/Survey3';
import SignupEmail from './screens/Signup/SIgnupEmail';
import SignupPwd from './screens/Signup/SignupPwd';
import SignupUser from './screens/Signup/SignupUser';
import AccessGrant from './screens/Onboarding/AccessGrant';
import {View} from 'react-native';
import colors from './styles/colors';
import SplashScreen from './screens/SplashScreen';
import AppleLoginPage from './screens/AppleLoginTest';
import {LogBox} from 'react-native';
import GlobalLoading from './components/GlobalLoading';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Non-serializable values were found in the navigation state',
]);

const Stack = createStackNavigator<ScreenParamList>();

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(
        remoteMessage.notification?.body,
        remoteMessage.notification?.title,
      );
    });

    return unsubscribe;
  }, []);
  const persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={'LoginMain'}>
              <Stack.Screen
                name="TabNavContainer"
                component={TabNavContainer}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                  animationEnabled: false,
                }}
              />
              <Stack.Screen
                name="SettingsMain"
                component={SettingsMain}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="FAQ"
                component={FAQ}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Help"
                component={Help}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="LoginMain"
                component={LoginMain}
                options={{
                  headerShown: false,
                  animationEnabled: false,
                }}
              />
              <Stack.Screen
                name="EmailRegisterMain"
                component={EmailRegisterMain}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ProfileMain"
                component={ProfileMain}
                options={{
                  headerShown: false,
                }}
              />
              {/* temporarily here for building */}
              <Stack.Screen
                name="MatZipMain"
                component={MatZipMain}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ListMaps"
                component={ListMaps}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="ZipList"
                component={ZipList}
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="Survey1"
                component={Survey1}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Survey2"
                component={Survey2}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Survey3"
                component={Survey3}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignupEmail"
                component={SignupEmail}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignupPwd"
                component={SignupPwd}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignupUser"
                component={SignupUser}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="AccessGrant"
                component={AccessGrant}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                  animationEnabled: false,
                }}
              />
            </Stack.Navigator>
            <GlobalLoading />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
