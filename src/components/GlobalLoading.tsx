/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useEffect, useState} from 'react';
import {useAppSelector} from '../store/hooks';
import {useDispatch} from 'react-redux';
import {updateIsLoadingAction} from '../store/modules/globalComponent';
import {ActivityIndicator, Text, View} from 'react-native';
import colors from '../styles/colors';

const GlobalLoading = () => {
  const isLoading = useAppSelector(state => state.globalComponents.isLoading);
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateIsLoadingAction(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (visible) {
      if (!isLoading) {
        setVisible(false);
      }
    } else {
      if (isLoading) {
        setVisible(true);
      }
    }
  }, [visible, isLoading]);

  if (!visible) {
    return null;
  } else {
    return (
      <View
        style={{
          position: 'absolute',
          flex: 1,
          width: '100%',
          height: '100%',
          zIndex: 100000000,
        }}>
        <View style={{position: 'absolute', width: '100%', height: '100%'}}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'black',
              opacity: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </View>
        <View style={{position: 'absolute', width: '100%', height: '100%'}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'none',
            }}>
            <ActivityIndicator
              size="large"
              color={colors.coral1}
              style={{marginTop: 100}}
            />
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 15,
                fontWeight: 'bold',
                color: 'white',
                marginTop: 20,
              }}>
              {'로딩중...'}
            </Text>
            <View style={{height: 150}} />
          </View>
        </View>
      </View>
    );
  }
};

export default GlobalLoading;
