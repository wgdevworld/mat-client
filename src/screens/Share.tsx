import React from 'react';
import {View, Button} from 'react-native';
import {ShareMenuReactView} from 'react-native-share-menu';

const Share = () => {
  return (
    <View>
      <Button
        title="Dismiss"
        onPress={() => {
          ShareMenuReactView.dismissExtension();
        }}
      />
      <Button
        title="Send"
        onPress={() => {
          // Share something before dismissing
          ShareMenuReactView.dismissExtension();
        }}
      />
      <Button
        title="Dismiss with Error"
        onPress={() => {
          ShareMenuReactView.dismissExtension('Something went wrong!');
        }}
      />
      <Button
        title="Continue In App"
        onPress={() => {
          ShareMenuReactView.continueInApp();
        }}
      />
      <Button
        title="Continue In App With Extra Data"
        onPress={() => {
          ShareMenuReactView.continueInApp({hello: 'from the other side'});
        }}
      />
    </View>
  );
};

export default Share;
