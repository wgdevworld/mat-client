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
<<<<<<< HEAD
import MatZip from './screens/MatZip';
import ListMaps from './screens/ListMaps';
=======
import messaging from '@react-native-firebase/messaging';
import {onDisplayNotification} from './controls/NotificationControl';
>>>>>>> main

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
            <Stack.Navigator initialRouteName={'TabNavContainer'}>
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
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
