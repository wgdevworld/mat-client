/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import axios from 'axios';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';
import colors from '../styles/colors';
import {useDispatch} from 'react-redux';
import {updateIsFromSocialAction} from '../store/modules/globalComponent';
import assets from '../../assets';

export default function Login() {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const [email, setUserEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdInvisible, setPwdInvisible] = useState(true);

  const onLogin = () => {
    const query = `
    mutation login(
      $email: String!
      $pwd: String!) {
        login(email: $email, pwd: $pwd)
    }
  `;
    const queryVariables = {
      email,
      pwd,
    };
    axios
      .post(
        'https://muckit-server.site/graphql',
        {
          query,
          variables: queryVariables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then((result: {data: any}) => {
        console.log(result.data);
        result.data.data === null
          ? Alert.alert('이메일이나 비밀번호를 확인해주세요.')
          : (async () => {
              const now = new Date();
              await AsyncStorage.multiSet([
                [
                  ASYNC_STORAGE_ENUM.REFRESH_TOKEN,
                  result.data.data.login[1].replace('refreshToken=', ''),
                ],
                [
                  ASYNC_STORAGE_ENUM.ID_TOKEN,
                  result.data.data.login[0].replace('accessToken=', ''),
                ],
                [ASYNC_STORAGE_ENUM.IS_LOGGED_IN, 'true'],
                [ASYNC_STORAGE_ENUM.TOKEN_TIME, now.toString()],
              ]);
              navigation.navigate('SplashScreen');
            })();
      })
      .catch(e => console.log(e.response ? e.response.data : e.message));
  };

  useEffect(() => {
    const deepLinkNavigation = async (url: string) => {
      console.log(url);
      const route = url.split('?')[0]?.replace(/.*?:\/\//g, '');

      if (route === 'kakao-login') {
        // Extract the access token and refresh token
        const accessToken = url.split('?')[1].split('=')[1];
        const refreshToken = url.split('?')[2].split('=')[1];
        console.log('ℹ️ Access token via kakao login: ' + accessToken);
        console.log('ℹ️ Refresh token via kakao login: ' + refreshToken);
        if (!accessToken || !refreshToken) {
          Alert.alert('다른 로그인 방법을 선택해주세요.');
        } else {
          AsyncStorage.multiSet([
            [ASYNC_STORAGE_ENUM.ID_TOKEN, accessToken],
            [ASYNC_STORAGE_ENUM.REFRESH_TOKEN, refreshToken],
            [ASYNC_STORAGE_ENUM.TOKEN_TIME, new Date().toString()],
          ]).then(async () => {
            dispatch(updateIsFromSocialAction(true));
            let isOnboardingDone = await AsyncStorage.getItem(
              ASYNC_STORAGE_ENUM.IS_ONBOARDING_DONE,
            );
            if (!isOnboardingDone) {
              navigation.navigate('SignupUser');
            } else {
              await AsyncStorage.setItem(
                ASYNC_STORAGE_ENUM.IS_LOGGED_IN,
                'true',
              );
              navigation.navigate('SplashScreen');
            }
          });
          return;
        }
      }
    };

    Linking.getInitialURL().then(value => {
      if (!value) {
        return;
      }
      deepLinkNavigation(value);
    });

    Linking?.addEventListener('url', e => {
      deepLinkNavigation(e.url);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithKakao = async () => {
    try {
      const url = 'https://muckit-server.site/login/kakao';
      Linking.openURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  async function onAppleButtonPress() {
    let user;
    let accessToken;
    console.warn('Beginning Apple Authentication');

    // start login request
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus,
      } = appleAuthRequestResponse;

      user = newUser;

      if (identityToken) {
        // sign in with Firebase Auth using nonce & identityToken
        accessToken = identityToken;
      } else {
        // 음 no token - failed sign-in?
      }
      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        console.log("I'm a real person!");
      }
      console.warn(`Apple Authentication Completed, ${user}, ${email}`);
    } catch (error) {
      console.log(error);
    } finally {
      const appleLoginQuery = `
        mutation loginApple(
          $identity_token: String!
        ) {
          loginApple(identity_token: $identity_token)
        }
      `;
      const appleLoginQueryVariables = {
        identity_token: accessToken,
      };
      axios
        .post(
          'https://muckit-server.site/graphql',
          {
            query: appleLoginQuery,
            variables: appleLoginQueryVariables,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        )
        .then(async (result: {data: any}) => {
          console.log(result.data.data);
          dispatch(updateIsFromSocialAction(true));
          await AsyncStorage.multiSet([
            [
              ASYNC_STORAGE_ENUM.REFRESH_TOKEN,
              result.data.data.loginApple[1].replace('refreshToken=', ''),
            ],
            [
              ASYNC_STORAGE_ENUM.ID_TOKEN,
              result.data.data.loginApple[0].replace('accessToken=', ''),
            ],
            [ASYNC_STORAGE_ENUM.IS_LOGGED_IN, 'true'],
            [ASYNC_STORAGE_ENUM.TOKEN_TIME, new Date().toString()],
          ]);
          let isOnboardingDone = await AsyncStorage.getItem(
            ASYNC_STORAGE_ENUM.IS_ONBOARDING_DONE,
          );
          if (!isOnboardingDone) {
            navigation.navigate('SignupUser');
          } else {
            AsyncStorage.setItem(ASYNC_STORAGE_ENUM.IS_LOGGED_IN, 'true');
            navigation.navigate('SplashScreen');
          }
        })
        .catch(e => console.log(e));
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.content}>
          <Text style={styles.text}>muckit!</Text>
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Ionicons name="mail" size={15} color={'white'} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="이메일 주소"
              placeholderTextColor="white"
              selectionColor="white"
              onChangeText={value => setUserEmail(value)}
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Ionicons name="lock-closed-outline" size={15} color={'white'} />
            </View>
            <TextInput
              secureTextEntry={pwdInvisible}
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor="white"
              selectionColor="white"
              onChangeText={value => setPwd(value)}
            />
            <TouchableOpacity
              onPress={() => {
                setPwdInvisible(!pwdInvisible);
              }}
              style={styles.passwordVisibleButton}>
              <Ionicons name="eye-off" size={15} color={'white'} />
            </TouchableOpacity>
          </View>
          <View style={styles.forgotButtons}>
            <TouchableOpacity style={styles.forgotIdButton}>
              <Text style={styles.forgotIdButtonText}>아이디 찾기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordButtonText}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => onLogin()}
            style={styles.loginButton}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>또는</Text>
            <View style={styles.orLine} />
          </View>
          <TouchableOpacity
            onPress={() => {
              dispatch(updateIsFromSocialAction(false));
              navigation.navigate('SignupEmail');
            }}
            style={styles.setAccountButtonEmail}>
            <Text style={styles.setAccountButtonTextEmail}>
              이메일로 회원가입하기
            </Text>
          </TouchableOpacity>

          {appleAuth.isSupported && (
            <AppleButton
              buttonStyle={AppleButton.Style.BLACK}
              onPress={onAppleButtonPress}
              style={styles.setAccountButton}
              cornerRadius={10}
            />
          )}
          <TouchableOpacity onPress={signInWithKakao}>
            <View
              style={{
                flexDirection: 'row',
                height: 45,
                padding: 16,
                backgroundColor: '#FEE500',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                resizeMethod={'auto'}
                source={assets.images.kakao_login_medium_narrow}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.coral1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
    marginTop: 60,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  icon: {
    marginRight: 15,
  },
  input: {
    borderWidth: 0.9,
    flex: 1,
    padding: 10,
    borderColor: '#eee',
    borderRadius: 10,
    fontSize: 16,
    color: 'white',
  },
  passwordVisibleButton: {
    position: 'absolute',
    marginRight: 10,
    right: 0,
  },
  forgotButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 15,
  },
  forgotPasswordButton: {
    flex: 1,
    // alignSelf: "flex-end",
  },
  forgotPasswordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    alignSelf: 'flex-end',
  },
  forgotIdButton: {
    flex: 1,
    // alignSelf: "flex-start",
  },
  forgotIdButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    height: 47,
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  setAccountButton: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    height: 46,
  },
  setAccountButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  setAccountButtonEmail: {
    backgroundColor: colors.grey,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    height: 45,
  },
  setAccountButtonTextEmail: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orContainer: {
    flexDirection: 'row',
    alighItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  orLine: {
    height: 1,
    backgroundColor: 'white',
    flex: 1,
  },
  orText: {
    color: 'white',
    marginRight: 10,
    marginLeft: 10,
    fontSize: 14,
    alignContent: 'center',
  },
  appleButton: {
    width: 200,
    height: 60,
    margin: 10,
  },
  // kakaoButton: {
  //   backgroundColor: "yellow",
  //   padding: 14,
  //   borderRadius: 10,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   position: "relative",
  // },
  // kakaoButtonText: {
  //   color: "black",
  //   fontSize: 16,
  //   fontWeight: "500",
  //   textAlign: "center",
  // },
});
