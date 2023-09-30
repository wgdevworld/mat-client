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
import TabNavContainer from './screens/TabNavContainer';
import MatZipMain from './screens/MatZipMain';
import ListMaps from './screens/ListMaps';
import messaging from '@react-native-firebase/messaging';
import {onDisplayNotification} from './controls/NotificationControl';
import EmailRegisterMain from './screens/EmailRegisterMain';
import ZipList from './screens/ZipList';
import ProfileMain from './screens/ProfileMain';

import {LogBox, View} from 'react-native';
import colors from './styles/colors';
import SplashScreen from './screens/SplashScreen';
import AppleLoginPage from './screens/AppleLoginTest';
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
                name="LoginMain"
                component={LoginMain}
                options={{
                  headerShown: false,
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
                name="SplashScreen"
                component={SplashScreen}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                  animationEnabled: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
