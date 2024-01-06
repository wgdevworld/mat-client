import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../../types/navigation';
import {useAppSelector} from '../../store/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_ENUM} from '../../types/asyncStorage';

export default function Welcome() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const isFromSocial = useAppSelector(
    state => state.globalComponents.isFromSocial,
  );
  const handleNext = async () => {
    await AsyncStorage.setItem(ASYNC_STORAGE_ENUM.IS_ONBOARDING_DONE, 'true');
    if (isFromSocial) {
      await AsyncStorage.setItem(ASYNC_STORAGE_ENUM.IS_LOGGED_IN, 'true');
      navigation.navigate('SplashScreen');
    } else {
      navigation.navigate('LoginMain');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>환영합니다!</Text>
      <Text style={styles.subtitle}>
        나만의 맛집 버킷리스트,
        {'\n'}
        먹킷리스트를 지금 만들어 보세요.
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {isFromSocial ? '시작하기' : '로그인하러 가기'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 10,
    position: 'absolute',
    top: '40%',
    marginLeft: 30,
  },
  subtitle: {
    fontSize: 23,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 20,
    position: 'absolute',
    top: '50%',
    marginLeft: 30,
  },
  startButton: {
    backgroundColor: colors.coral1,
    width: 330,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    position: 'absolute',
    bottom: 45,
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: '500',
  },
});
