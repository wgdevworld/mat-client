/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import colors from '../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../../types/navigation';
import {useDispatch} from 'react-redux';
import {updateUsernameAction} from '../../store/modules/user';
import {useAppSelector} from '../../store/hooks';
import {REQ_METHOD, request} from '../../controls/RequestControl';
import {updateIsLoadingAction} from '../../store/modules/globalComponent';
import Header from '../../components/Header';

export default function SignupUser() {
  const dispatch = useDispatch();
  const user = useAppSelector(state => state.user);
  const isFromSocial = useAppSelector(
    state => state.globalComponents.isFromSocial,
  );
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const [username, setUsername] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);

  const handleNext = () => {
    if (username.trim() === '') {
      setIsEmpty(true);
    } else {
      onNext();
    }
  };

  async function onNext() {
    if (username === '운영자') {
      Alert.alert('사용 불가능한 유저네임입니다!');
      return;
    }
    dispatch(updateUsernameAction(username));
    if (!isFromSocial) {
      try {
        dispatch(updateIsLoadingAction(true));
        const usernameForQuery = username;
        const emailForQuery = user.email;
        const pwdForQuery = user.password;

        const createUserVariables = {
          createUserInput: {
            name: usernameForQuery,
            username: usernameForQuery,
            email: emailForQuery,
            pwd: pwdForQuery,
            address: '없음',
          },
        };

        const createUserQuery = `
            mutation createUser($createUserInput: CreateUserInput!) {
                createUser(userInput: $createUserInput) {
                    username
                    id
                    email
            }
        }`;

        await request(
          createUserQuery,
          REQ_METHOD.MUTATION,
          createUserVariables,
          true,
        );
        navigation.reset({
          index: 1,
          routes: [{name: 'LoginMain'}, {name: 'AccessGrant'}],
        });
      } catch (e) {
        console.log(e);
      } finally {
        dispatch(updateIsLoadingAction(false));
      }
    } else {
      try {
        dispatch(updateIsLoadingAction(true));
        const usernameForQuery = username;
        const updateUserVariables = {
          updateUserInput: {
            username: usernameForQuery,
          },
        };

        const updateUserQuery = `
            mutation updateUser($updateUserInput: UpdateUserInput!) {
                updateUser(userInput: $updateUserInput) {
                  id
            }
        }`;

        await request(
          updateUserQuery,
          REQ_METHOD.MUTATION,
          updateUserVariables,
        );
        navigation.reset({
          index: 1,
          routes: [{name: 'LoginMain'}, {name: 'AccessGrant'}],
        });
      } catch (e) {
        console.log(e);
      } finally {
        dispatch(updateIsLoadingAction(false));
      }
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.coral1}}>
      <Header
        onPressBack={() => navigation.goBack()}
        color={colors.coral1}
        buttonColor={colors.white}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>회원가입</Text>
      </View>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
      </View>
      <Text style={styles.title}>{'유저네임을 선택해주세요!'}</Text>
      <View style={styles.container}>
        <TextInput
          style={[styles.input, styles.placeholderBackground]}
          onChangeText={value => setUsername(value)}
          value={username}
          placeholder="유저네임 입력"
        />
        {isEmpty && (
          <Text style={styles.errorText}>유저네임을 입력해주세요!</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>가입 완료</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.coral1,
    paddingBottom: 30,
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
    width: '100%',
  },
  container: {
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginLeft: 35,
    marginTop: 30,
    marginBottom: 20,
    color: 'white',
  },
  placeholderBackground: {
    backgroundColor: 'white',
  },
  input: {
    width: 320,
    height: 60,
    borderRadius: 5,
    borderColor: '#ccc',
    padding: 15,
    fontSize: 18,
  },
  button: {
    position: 'absolute',
    bottom: 10,
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
    position: 'absolute',
    bottom: 70,
    color: 'white',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
});
