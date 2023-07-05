import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Login() {
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
          <Text style={styles.text}>로그인</Text>
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Ionicons name="mail" size={15} color={'white'} />
            </View>
            <TextInput
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
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor="white"
              selectionColor="white"
            />
            <TouchableOpacity style={styles.passwordVisibleButton}>
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
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>또는</Text>
            <View style={styles.orLine} />
          </View>
          <TouchableOpacity style={styles.setAccountButton}>
            <Text style={styles.setAccountButtonText}>회원가입</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../assets/image/kakao_login_medium_narrow.png')}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  icon: {
    marginRight: 15,
  },
  input: {
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
