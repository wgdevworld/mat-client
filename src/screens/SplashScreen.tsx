import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import React, {useEffect, useState} from 'react';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';
import { fetchAllMaps } from '../controls/MatMapControl';
import { useDispatch } from 'react-redux';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();

  useEffect(() => {
    AsyncStorage.getItem(ASYNC_STORAGE_ENUM.USER_EMAIL).then(value => {
      navigation.replace(value === null ? 'LoginMain' : 'TabNavContainer');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
};

export default SplashScreen;
