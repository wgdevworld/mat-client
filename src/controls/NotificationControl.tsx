import messaging from '@react-native-firebase/messaging';

export const initPushNotification = async () => {
  // Register the device with FCM
  try {
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();

    console.log('Token: ' + token);
  } catch (e) {
    console.log(e);
  }

  //TODO: post to server
  //   // Save the token
  //   await postToApi('/users/1234/tokens', {token});
};
