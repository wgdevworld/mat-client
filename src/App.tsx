import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ScreenParamList} from './types/navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import store, {initStore} from './store/store';
import {PersistGate} from 'redux-persist/integration/react';
import SettingsMain from './screens/SettingsMain';
import LoginMain from './screens/LoginMain';
import TabNavContainer from './screens/TabNavContainer';
import MatZip from './screens/MatZip';
import ListMaps from './screens/ListMaps';
import messaging from '@react-native-firebase/messaging';
import {onDisplayNotification} from './controls/NotificationControl';
import EmailRegisterMain from './screens/EmailRegisterMain';
import ZipList from './screens/ZipList';
import ProfileMain from './screens/ProfileMain';
import {View} from 'react-native';
import colors from './styles/colors';
<<<<<<< HEAD
import ChangePwdScreen from './screens/ChangePwdScreen';
=======
import SplashScreen from './screens/SplashScreen';
import AppleLoginPage from './screens/AppleLoginTest';
>>>>>>> main
const Stack = createStackNavigator<ScreenParamList>();

const App = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(
        remoteMessage.notification?.body,
        remoteMessage.notification?.title,
      );
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // timeOutId = setTimeout(() => {
    //   SplashScreen.hide();
    // }, 1000);

    const init = async () => {
      await initStore();

      setIsLoaded(true);
    };

    init();

    // return () => clearTimeout(timeOutId);
  }, []);

  if (!isLoaded) {
    return <View style={{flex: 1, backgroundColor: colors.dark}} />;
  }

  const persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName={'MapMain'}>
              <Stack.Screen
                name="AppleLoginTest"
                component={AppleLoginPage}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                  animationEnabled: false,
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
                name="MatZip"
                component={MatZip}
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
                name="ChangePwdScreen"
                component={ChangePwdScreen}
                options={{
                  headerShown: false,
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
