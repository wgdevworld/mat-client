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
import colors from '../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../../types/navigation';


export default function SignupPwd() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false); // New state for password mismatch

  const handleNext = () => {
    if (password === confirmPassword) {
      onNext(password);
    } else {
      // Handle password mismatch error
      setPasswordMismatch(true);
    }
  };

  function onNext(pwd: string) {
    navigation.navigate('AccessGrant');
  }

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.coral1,}}>
        <View style={styles.header}>
          <Text style={styles.headerText}>회원가입</Text>
        </View>
        <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        </View>
        <Text style={styles.title}>로그인에 사용할 비밀번호를 입력해주세요.</Text>
        <View style={styles.container}>
          <TextInput
            style={[styles.input, styles.placeholderBackground]}
            onChangeText={text => setPassword(text)}
            value={password}
            placeholder="비밀번호 입력"
            secureTextEntry
          />
          <TextInput
            style={[styles.input, styles.placeholderBackground]}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="비밀번호 재입력"
            secureTextEntry
          />
          {/* Display password mismatch message */}
          {passwordMismatch && (
            <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
          )} 
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>가입 완료</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
      );
    };

    const styles = StyleSheet.create({
      header: {
        backgroundColor: colors.coral1,
        paddingVertical: 30,
        alignItems: 'center',
      },
      headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
      },
      dividerContainer: {
        marginTop: 10,
        marginHorizontal: 35,
      },
      divider: {
        height: 5,
        backgroundColor: 'white',
        width: '75%',
      },
      container: {
          flex: 1,
          marginTop: 20, 
          alignItems: 'center',
        },
        title: {
          fontSize: 20,
          marginLeft: 35,
          marginTop: 40,
          marginBottom: 20,
          color: 'white',
        },
        placeholderBackground: {
          backgroundColor: 'white', // Set background color for placeholder
        },
        input: {
          width: 320,
          height: 60,
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 15,
          marginBottom: 20,
          fontSize: 18,
        },
        button: {
          backgroundColor: colors.grey2,
          width: 320,
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          borderRadius: 5,
        },
        buttonText: {
          color: 'white',
          fontSize: 20,
        },
        errorText: {
          color: 'white',
          marginBottom: 15,
        },
      });


