import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {createUserAction} from '../store/modules/user';
import {User} from '../types/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';

const EmailRegisterMain = () => {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [address, setAddress] = useState('천국');

  const onPressRegister = async () => {
    try {
      const variables = {
        createUserInput: {
          name: name,
          username: username,
          email: email,
          pwd: pwd,
          address: 'lololo',
        },
      };

      const query = `
            mutation createUser($createUserInput: CreateUserInput!) {
                createUser(userInput: $createUserInput) {
                    username
                    id
                    email
            }
        }`;

      let res = null;
      axios
        .post(
          'https://muckit-server.site/graphql',
          {
            query,
            variables,
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
          res = result.data;
        })
        .catch(e => console.log(e));

      console.log(res);
      const user: User = {
        id: '',
        name: name,
        username: '사과',
        email: email,
        address: address,
        userMaps: [],
        followingMaps: [],
        deviceToken: 'asdfasdfafd',
        pushAllowStatus: false,
      };
      dispatch(createUserAction(user));
      AsyncStorage.setItem(ASYNC_STORAGE_ENUM.USER_EMAIL, email);
      navigation.navigate('SplashScreen');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.content}>
          <Text style={styles.text}>회원가입</Text>
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Ionicons name="person" size={15} color={'white'} />
            </View>
            <TextInput
              onChangeText={text => setName(text)}
              style={styles.input}
              placeholder="성함"
              placeholderTextColor="white"
              selectionColor="white"
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Ionicons name="happy" size={15} color={'white'} />
            </View>
            {/* //TODO: 중복 체크 버튼 추가 */}
            <TextInput
              onChangeText={text => setUsername(text)}
              style={styles.input}
              placeholder="유저네임"
              placeholderTextColor="white"
              selectionColor="white"
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Ionicons name="mail" size={15} color={'white'} />
            </View>
            <TextInput
              onChangeText={text => setEmail(text)}
              style={styles.input}
              placeholder="이메일 주소"
              placeholderTextColor="white"
              selectionColor="white"
            />
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Ionicons name="lock-closed-outline" size={15} color={'white'} />
            </View>
            <TextInput
              onChangeText={text => setPwd(text)}
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor="white"
              selectionColor="white"
            />
            <TouchableOpacity style={styles.passwordVisibleButton}>
              <Ionicons name="eye-off" size={15} color={'white'} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              onPressRegister();
            }}
            style={styles.setAccountButton}>
            <Text style={styles.setAccountButtonText}>가입하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF4000',
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
    marginTop: 0,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    width: '126%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  icon: {
    marginRight: 15,
  },
  input: {
    color: colors.white,
    borderBottomWidth: 1.5,
    flex: 1,
    paddingBottom: 10,
    borderBottomColor: '#eee',
    fontSize: 16,
  },
  passwordVisibleButton: {
    position: 'absolute',
    right: 0,
  },
  forgotButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordButton: {
    flex: 1,
    // alignSelf: "flex-end",
  },
  forgotPasswordButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
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
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  setAccountButton: {
    backgroundColor: 'black',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 30,
  },
  setAccountButtonText: {
    color: 'white',
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

export default EmailRegisterMain;
