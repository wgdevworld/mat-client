// Deprecated file that uses mauron85/react-native-background-geolocation
// issue was that the background task kept getting terminated
// migrating to transistor soft's background geolocation library

// //https://github.com/mauron85/react-native-background-geolocation
// import {Alert} from 'react-native/Libraries/Alert/Alert';
import {Coordinate, MatMap, MatZip} from '../types/store';
import {calculateDistance} from '../tools/CommonFunc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';
import {REQ_METHOD, request} from './RequestControl';
import store from '../store/store';
// import store from '../'

// // APPLE 에서 machine learning 알고리즘 background task 의배터리 소모량을 최소화하려고
// // 1. 맨 처음 background task 조금 걸리수도 있대 사람들 말 들어보니까
// // 15분마다 한번씩 돌아가게 <- 무조건 이게 아님
// // 모름 아무도 모름 이게 돌아가는 원리

// export const initBGLocation = async () => {
//   const notiRadius = await AsyncStorage.getItem(
//     ASYNC_STORAGE_ENUM.NOTIFICATION_RADIUS,
//   );
//   try {
//     BackgroundGeolocation.configure({
//       desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY,
//       stationaryRadius: notiRadius ? parseInt(notiRadius, 10) / 20 : 2000 / 20,
//       distanceFilter: notiRadius ? parseInt(notiRadius, 10) / 2 : 2000 / 2,
//       debug: true,
//       startOnBoot: false,
//       stopOnTerminate: false,
//       saveBatteryOnBackground: false,
//       locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
//     });
//   } catch {
//     (error: string) => {
//       console.log('⛔️ Background location configuration error' + error);
//       Bugsnag.notify(error);
//     };
//   }
// };

// export const updateLocationAndSendNoti = async () => {
//   const notiRadius = await AsyncStorage.getItem(
//     ASYNC_STORAGE_ENUM.NOTIFICATION_RADIUS,
//   );
//   BackgroundGeolocation.configure({
//     desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY,
//     stationaryRadius: notiRadius ? parseInt(notiRadius, 10) / 20 : 2000 / 20,
//     distanceFilter: notiRadius ? parseInt(notiRadius, 10) / 2 : 2000 / 2,
//     debug: false,
//     startOnBoot: false,
//     stopOnTerminate: false,
//     saveBatteryOnBackground: true,
//     locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
//   });
//   BackgroundGeolocation.on('location', location => {
//     BackgroundGeolocation.startTask(async taskKey => {
//       try {
//         const curLocation: Coordinate = {
//           latitude: location.latitude,
//           longitude: location.longitude,
//         };
//         const currentState = store.getState();
//         const userOwnMap = currentState.userMaps.ownMaps;
//         const followingMap = currentState.userMaps.followingMaps;
//         const allSavedZips = [
//           ...userOwnMap.flatMap((allMaps: MatMap) => allMaps.zipList),
//           ...followingMap.flatMap((allMaps: MatMap) => allMaps.zipList),
//         ];
//         // TODO: uncomment cooldown logic once long running background tasks are supported
//         const radius = await AsyncStorage.getItem(
//           ASYNC_STORAGE_ENUM.NOTIFICATION_RADIUS,
//         );
//         const parsedRadius = radius ? parseInt(radius, 10) : 2000;
//         let closeMatZips: string[];
//         closeMatZips = [];
//         allSavedZips.forEach((zip: MatZip) => {
//           // TODO: implement cooldown feature in the future; does not work in background as is (only in foreground)
//           // const lastNotifiedTime = lastNotified[zip.name];
//           if (
//             calculateDistance(zip.coordinate, curLocation) < parsedRadius
//             //  &&
//             // (!lastNotifiedTime ||
//             //   Date.now() - lastNotifiedTime > COOLDOWN_TIME)
//           ) {
//             closeMatZips.push(zip.name);
//             // store.dispatch(
//             //   setLastNotified({zipName: zip.name, timestamp: Date.now()}),
//             // );
//           }
//         });
//         const numCloseMatZips = closeMatZips.length;
//         if (numCloseMatZips) {
//           const notiToken = await AsyncStorage.getItem(
//             ASYNC_STORAGE_ENUM.NOTI_TOKEN,
//           );
//           let notificationMessage;
//           if (numCloseMatZips > 2) {
//             notificationMessage = `${parsedRadius}m 근처에 ${
//               closeMatZips[0]
//             }, ${closeMatZips[1]} 외 ${numCloseMatZips - 2}개의 맛집이 있어요!`;
//           } else if (numCloseMatZips > 1) {
//             notificationMessage = `${parsedRadius}m 근처에 저장하신 ${closeMatZips[0]}와 ${closeMatZips[1]}가 있어요!`;
//           } else {
//             notificationMessage = `${parsedRadius}m 근처에 ${closeMatZips[0]} 가 있어요!`;
//           }

//           const notificationQuery = `
//                       mutation sendNotification($deviceToken: String!, $message: String!) {
//                           sendNotification(deviceToken: $deviceToken, message: $message)
//                       }
//                       `;
//           const variables = {
//             deviceToken: notiToken,
//             message: notificationMessage,
//           };

//           await request(notificationQuery, REQ_METHOD.MUTATION, variables);
//           BackgroundGeolocation.endTask(taskKey);
//         } else {
//           BackgroundGeolocation.endTask(taskKey);
//         }
//       } catch (e) {
//         Bugsnag.notify(new Error(e as string));
//         BackgroundGeolocation.endTask(taskKey);
//       }
//       // .catch(e => Bugsnag.notify(new Error(e)));
//     });
//   });

//   // TODO: Use when debugging BG notification
//   // BackgroundGeolocation.on('stationary', location => {
//   //   console.log('[DEBUG] BackgroundGeolocation stationary', location);
//   //   BackgroundGeolocation.startTask(taskKey => {
//   //     AsyncStorage.getItem(ASYNC_STORAGE_ENUM.NOTI_TOKEN).then(token => {
//   //       const testNoti = `거리 디버깅 알림: ${location.latitude}, ${location.longitude}`;
//   //       // Test notification for debugging purposes
//   //       const testQuery = `
//   //                 mutation sendNotification($deviceToken: String!, $message: String!) {
//   //                     sendNotification(deviceToken: $deviceToken, message: $message)
//   //                 }
//   //                 `;
//   //       const testVariables = {
//   //         deviceToken: token,
//   //         message: testNoti,
//   //       };
//   //       request(testQuery, REQ_METHOD.MUTATION, testVariables).catch(e =>
//   //         Bugsnag.notify(new Error(e)),
//   //       );
//   //       BackgroundGeolocation.endTask(taskKey);
//   //     });
//   //   });
//   // });

//   BackgroundGeolocation.on('error', error => {
//     console.log('[ERROR] BackgroundGeolocation error:', error);
//     Bugsnag.notify(new Error(String(error)));
//   });

//   // BackgroundGeolocation.on('start', () => {
//   //   console.log('[INFO] BackgroundGeolocation service has been started');
//   // });

//   // BackgroundGeolocation.on('stop', () => {
//   //   console.log('[INFO] BackgroundGeolocation service has been stopped');
//   // });

//   // BackgroundGeolocation.on('authorization', status => {
//   //   console.log(
//   //     '[INFO] BackgroundGeolocation authorization status: ' + status,
//   //   );
//   //   if (status !== BackgroundGeolocation.AUTHORIZED) {
//   //     // we need to set delay or otherwise alert may not be shown
//   //     setTimeout(
//   //       () =>
//   //         Alert.alert(
//   //           '근처 맛집 알림을 받으려면 알림을 허용해야해요',
//   //           '알림 설정을 열까요?',
//   //           [
//   //             {
//   //               text: 'Yes',
//   //               onPress: () => BackgroundGeolocation.showAppSettings(),
//   //             },
//   //             {
//   //               text: 'No',
//   //               onPress: () => console.log('No Pressed'),
//   //               style: 'cancel',
//   //             },
//   //           ],
//   //         ),
//   //       1000,
//   //     );
//   //   }
//   // });

//   // BackgroundGeolocation.on('background', () => {
//   //   console.log('[INFO] App is in background');
//   // });

//   // BackgroundGeolocation.on('foreground', () => {
//   //   console.log('[INFO] App is in foreground');
//   // });

//   // BackgroundGeolocation.on('abort_requested', () => {
//   //   console.log('[INFO] Server responded with 285 Updates Not Required');

//   // Here we can decide whether we want stop the updates or not.
//   // If you've configured the server to return 285, then it means the server does not require further update.
//   // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
//   // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
//   // });

//   // BackgroundGeolocation.on('http_authorization', () => {
//   //   console.log('[INFO] App needs to authorize the http requests');
//   //   Bugsnag.notify(
//   //     new Error('[INFO] App needs to authorize the http requests'),
//   //   );
//   // });

//   BackgroundGeolocation.checkStatus(status => {
//     console.log(
//       '[INFO] BackgroundGeolocation service is running',
//       status.isRunning,
//     );
//     console.log(
//       '[INFO] BackgroundGeolocation services enabled',
//       status.locationServicesEnabled,
//     );
//     console.log(
//       '[INFO] BackgroundGeolocation auth status: ' + status.authorization,
//     );
//     BackgroundGeolocation.start(); //triggers start on start event
//   });
// };

import {Location} from 'react-native-background-geolocation';
import {setLastNotified} from '../store/modules/notificationCooldown';

export const locationBackgroundTask = async (location: Location) => {
  try {
    const curLocation: Coordinate = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    const currentState = store.getState();
    const userOwnMap = currentState.userMaps.ownMaps;
    const followingMap = currentState.userMaps.followingMaps;
    const allSavedZips = [
      ...userOwnMap.flatMap((allMaps: MatMap) => allMaps.zipList),
      ...followingMap.flatMap((allMaps: MatMap) => allMaps.zipList),
    ];
    const lastNotified = currentState.notificationCooldown.lastNotified;
    const radius = await AsyncStorage.getItem(
      ASYNC_STORAGE_ENUM.NOTIFICATION_RADIUS,
    );
    const parsedRadius = radius ? parseInt(radius, 10) : 2000;
    const interval = await AsyncStorage.getItem(
      ASYNC_STORAGE_ENUM.NOTIFICATION_INTERVAL,
    );
    const parsedInterval = interval
      ? parseInt(interval, 10) * 60 * 60 * 1000
      : 6 * 60 * 60 * 1000;

    let closeMatZipsSet = new Set();

    allSavedZips.forEach((zip: MatZip) => {
      const lastNotifiedTime = lastNotified[zip.name];
      if (
        calculateDistance(zip.coordinate, curLocation) < parsedRadius &&
        (!lastNotifiedTime || Date.now() - lastNotifiedTime > parsedInterval)
      ) {
        closeMatZipsSet.add(zip.name);
        store.dispatch(
          setLastNotified({zipName: zip.name, timestamp: Date.now()}),
        );
      }
    });

    let closeMatZips = Array.from(closeMatZipsSet);
    const numCloseMatZips = closeMatZips.length;
    if (numCloseMatZips) {
      const notiToken = await AsyncStorage.getItem(
        ASYNC_STORAGE_ENUM.NOTI_TOKEN,
      );
      let notificationMessage;
      if (numCloseMatZips > 2) {
        notificationMessage = `최대 ${parsedRadius}m 내에 ${closeMatZips[0]}, ${
          closeMatZips[1]
        } 외 ${numCloseMatZips - 2}개의 맛집이 있어요!`;
      } else if (numCloseMatZips > 1) {
        notificationMessage = `최대 ${parsedRadius}m 내에 ${closeMatZips[0]}와 ${closeMatZips[1]}(이)가 있어요!`;
      } else {
        notificationMessage = `최대 ${parsedRadius}m 내에 ${closeMatZips[0]}(이)가 있어요!`;
      }
      const notificationQuery = `
                        mutation sendNotification($deviceToken: String!, $message: String!) {
                            sendNotification(deviceToken: $deviceToken, message: $message)
                        }
                        `;
      const variables = {
        deviceToken: notiToken,
        message: notificationMessage,
      };
      await request(notificationQuery, REQ_METHOD.MUTATION, variables);
    }
  } catch (e) {
    throw e;
  }
};
