/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {initPushNotification} from './src/controls/NotificationControl';

initPushNotification();
AppRegistry.registerComponent(appName, () => App);
