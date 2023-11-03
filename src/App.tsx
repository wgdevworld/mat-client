import React, {useEffect, useState} from 'react';
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
import {LogBox} from 'react-native';
import SplashScreen from './screens/SplashScreen';
import {Event} from './types/store';

import BackgroundFetch from 'react-native-background-fetch';
import {performYourBackgroundTask} from './controls/BackgroundTask';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Non-serializable values were found in the navigation state',
]);

const Stack = createStackNavigator<ScreenParamList>();

const App = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const addEvent = (taskId: string) => {
    const newEvent = {
      taskId: taskId,
      timestamp: new Date().toISOString(),
    };
    setEvents(currentEvents => [...currentEvents, newEvent]);
  };

  const initBackgroundFetch = async () => {
    const onEvent = async (taskId: string) => {
      console.log('[BackgroundFetch] task: ', taskId);
      // TODO: define background task
      await performYourBackgroundTask(taskId);
      await addEvent(taskId);
      BackgroundFetch.finish(taskId);
    };
    const onTimeout = async (taskId: string) => {
      console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
      BackgroundFetch.finish(taskId);
    };

    const status = await BackgroundFetch.configure(
      {minimumFetchInterval: 15},
      onEvent,
      onTimeout,
    );
    console.log('[BackgroundFetch] configure status: ', status);
  };

  useEffect(() => {
    initBackgroundFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <Stack.Screen
                name="MatZip"
                component={MatZipMain}
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
