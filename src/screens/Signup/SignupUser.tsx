import React, {useState} from 'react';
import {
  SafeAreaView,
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

export default function SignupUser() {  
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const [username, setUsername] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);
  const handleNext = () => {
    if (username.trim() === '') {
      setIsEmpty(true);
    } else {
      onNext(username);
    }
  };  
    function onNext(username: string) {
      navigation.navigate('SignupPwd');
    }

return (
  <SafeAreaView style={{flex: 1, backgroundColor: colors.coral1,}}>
    <View style={styles.header}>
        <Text style={styles.headerText}>회원가입</Text>
    </View>
    <View style={styles.dividerContainer}>
        <View style={styles.divider} />
    </View>
    <Text style={styles.title}>로그인에 사용할 아이디를 입력해주세요.</Text>
    <View style={styles.container}>
        <TextInput
        style={[styles.input, styles.placeholderBackground]}
        onChangeText={setUsername}
        value={username}
        placeholder="아이디 입력"
        />
        {isEmpty && <Text style={styles.errorText}>아이디를 입력하세요.</Text>}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>다음</Text>
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
        width: '66.6%',
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
        backgroundColor: 'black',
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
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
      },
    });
    
    
    