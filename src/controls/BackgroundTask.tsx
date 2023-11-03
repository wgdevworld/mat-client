//https://github.com/mauron85/react-native-background-geolocation
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import {Alert} from 'react-native/Libraries/Alert/Alert';
import {Coordinate, MatZip} from '../types/store';
import {calculateDistance} from '../tools/CommonFunc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';
import {REQ_METHOD, request} from './RequestControl';

export const initBGLocation = async () => {
  try {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
    });
  } catch {
    (error: string) =>
      console.log('⛔️ Background location configuration error' + error);
  }
};

export const updateLocationAndSendNoti = async (allSavedZips: MatZip[]) => {
  try {
    // background information configuration
    BackgroundGeolocation.on('location', location => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      const curLocation: Coordinate = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
      BackgroundGeolocation.startTask(taskKey => {
        let closeMatZips: string[];
        closeMatZips = [];
        allSavedZips.forEach((zip: MatZip) => {
          if (calculateDistance(zip.coordinate, curLocation) < 500) {
            closeMatZips.push(zip.name);
          }
        });
        const numCloseMatZips = closeMatZips ? closeMatZips.length : 0;

        if (numCloseMatZips) {
          AsyncStorage.getItem(ASYNC_STORAGE_ENUM.ID_TOKEN).then(
            async value => {
              let notificationMessage;
              if (numCloseMatZips > 2) {
                notificationMessage = `500m 근처에 ${closeMatZips[0]}, ${
                  closeMatZips[1]
                } 외 ${numCloseMatZips - 2} 개의 맛집이 있어요!`;
              } else if (numCloseMatZips > 1) {
                notificationMessage = `500m 근처에 저장하신 ${closeMatZips[0]}와 ${closeMatZips[1]} 가 있어요!`;
              } else {
                notificationMessage = `500m 근처에 ${closeMatZips[0]} 가 있어요!`;
              }

              const notificationQuery = `
                mutation sendNotification($deviceToken: String!, $message: String!) {
                    sendNotification(deviceToken: $deviceToken, message: $message)
                }
                `;
              const variables = {
                deviceToken: value,
                message: notificationMessage,
              };

              await request(notificationQuery, REQ_METHOD.MUTATION, variables);
            },
          );
        }

        BackgroundGeolocation.endTask(taskKey);
      });
    });

    BackgroundGeolocation.on('error', error => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', status => {
      console.log(
        '[INFO] BackgroundGeolocation authorization status: ' + status,
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay or otherwise alert may not be shown
        setTimeout(
          () =>
            Alert.alert(
              'App requires location tracking permission',
              'Would you like to open app settings?',
              [
                {
                  text: 'Yes',
                  onPress: () => BackgroundGeolocation.showAppSettings(),
                },
                {
                  text: 'No',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            ),
          1000,
        );
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('abort_requested', () => {
      console.log('[INFO] Server responded with 285 Updates Not Required');

      // Here we can decide whether we want stop the updates or not.
      // If you've configured the server to return 285, then it means the server does not require further update.
      // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
      // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
    });

    BackgroundGeolocation.on('http_authorization', () => {
      console.log('[INFO] App needs to authorize the http requests');
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log(
        '[INFO] BackgroundGeolocation service is running',
        status.isRunning,
      );
      console.log(
        '[INFO] BackgroundGeolocation services enabled',
        status.locationServicesEnabled,
      );
      console.log(
        '[INFO] BackgroundGeolocation auth status: ' + status.authorization,
      );

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });
    BackgroundGeolocation.removeAllListeners();
  } catch (error) {
    console.error('Error performing background task', error);
  }
};
