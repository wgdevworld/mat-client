import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {colors} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {resetPwd} from '../controls/UserControl';

export default function ChangePwdScreen() {
  const [newPwd, setNewPwd] = useState('');
  const [newPwdCheck, setNewPwdCheck] = useState('');
  const [printError, setPrintError] = useState(false);

  const handleChangePwd = () => {
    if (newPwd !== '' && newPwdCheck !== '' && newPwd === newPwdCheck) {
      resetPwd(newPwd);
      // 성공적으로 비밀번호를 변경했다는 메세지/스크린
    } else {
      setPrintError(true);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={styles.containter}>
        <Text style={styles.heading}> 비밀번호 변경</Text>
        <View style={{paddingHorizontal: 24}}>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="새 비밀번호를 입력하세요."
              value={newPwd}
              onChangeText={setNewPwd}
            />
            <TextInput
              style={styles.input}
              placeholder="새 비밀번호를 다시 입력하세요."
              value={newPwdCheck}
              onChangeText={setNewPwdCheck}
            />
            <Text style={styles.error}>
              {printError ? '비밀번호가 일치하지 않습니다.' : ''}
            </Text>
            <Button
              title="비밀번호 변경"
              onPress={handleChangePwd}
              color={colors.coral1}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  containter: {
    paddingVertical: 24,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  formContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 180,
    marginBottom: 40,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
});
