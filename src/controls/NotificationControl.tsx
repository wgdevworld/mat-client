import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';
import {REQ_METHOD, request} from './RequestControl';

export const initPushNotification = async () => {
  // Register the device with FCM
  try {
    // Get the token
    const token = await messaging().getToken();
    console.log('ℹ️ Notification token: ' + token);
    AsyncStorage.setItem(ASYNC_STORAGE_ENUM.NOTI_TOKEN, token);
    const tokenFromStorage = await AsyncStorage.getItem(
      ASYNC_STORAGE_ENUM.NOTI_TOKEN,
    );

    const testNoti = '테스트 알림';
    // Test notification for debugging purposes
    const notificationQuery = `
                mutation sendNotification($deviceToken: String!, $message: String!) {
                    sendNotification(deviceToken: $deviceToken, message: $message)
                }
                `;
    const variables = {
      deviceToken: tokenFromStorage,
      message: testNoti,
    };

    request(notificationQuery, REQ_METHOD.MUTATION, variables);

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      onDisplayNotification(
        remoteMessage.notification?.body,
        remoteMessage.notification?.title,
      );
    });
    // const query = `
    //   {
    //     fetchAllMaps {
    //       id
    //       name
    //     }
    //   }
    // `;
    // const res = await axios.post(
    //   'https://muckit-server.site/graphql',
    //   {
    //     query,
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );
    // console.log(res.data);

    //   const notificationQuery = `
    //   mutation sendNotification($deviceToken: String!, $message: String!) {
    //     sendNotification(deviceToken: $deviceToken, message: $message)
    //   }
    // `;
    //   const variables = {
    //     deviceToken: token,
    //     message: 'Hello',
    //   };

    //   await axios.post(
    //     'https://muckit-server.site/graphql',
    //     {
    //       query: notificationQuery,
    //       variables,
    //     },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         // other headers if needed
    //       },
    //     },
    //   );

    // console.log(res.data.data.fetchAllMaps);
  } catch (e) {
    console.log(e);
  }

  //TODO: post to server
  //   // Save the token
  //   await postToApi('/users/1234/tokens', {token});
};

export const onDisplayNotification = async (
  message?: string,
  title?: string,
) => {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // // Create a channel (required for Android)
  // const channelId = await notifee.createChannel({
  //   id: 'default',
  //   name: 'Default Channel',
  // });

  await notifee.displayNotification({
    title: title,
    body: message,
    // android: {
    //   channelId,
    //   smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
    //   // pressAction is needed if you want the notification to open the app when pressed
    //   pressAction: {
    //     id: 'default',
    //   },
    // },
  });
};
