/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {initPushNotification} from './src/controls/NotificationControl';
import 'react-native-get-random-values';
import Geocoder from 'react-native-geocoding';

initPushNotification();
Geocoder.init('AIzaSyDMSKeetZyFab4VFCpDZZ-jft7ledGM1NI');
console.log('ℹ️ initializing Google Geocoder API');
AppRegistry.registerComponent(appName, () => App);
