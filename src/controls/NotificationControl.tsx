import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

export const initPushNotification = async () => {
  // Register the device with FCM
  try {
    // Get the token
    const token = await messaging().getToken();
    console.log('Token: ' + token);

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      onDisplayNotification(
        remoteMessage.notification?.body,
        remoteMessage.notification?.title,
      );
    });
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
