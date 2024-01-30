/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import {useAppSelector} from '../store/hooks';
import {REQ_METHOD, request} from '../controls/RequestControl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import colors from '../styles/colors';
import {updateIsLoadingAction} from '../store/modules/globalComponent';
import {useDispatch} from 'react-redux';
import {updateUsernameAction} from '../store/modules/user';
import Header from '../components/Header';

export default function ProfileMain() {
  const dispatch = useDispatch();
  const user = useAppSelector(state => state.user);
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();

  const [isPressedChangeNickname, setIsPressedChangeNickname] = useState(false);
  const [nickname, setNickname] = React.useState('');
  // const [isEditAddr, setIsEditAddr] = React.useState(false);
  // const toggleEditAddr = () => setIsEditAddr(true);
  // const [addr, setAddr] = React.useState('서울시 중구 길동로 32');
  const [isPressedDeleteUser, setIsPressedDeleteUser] = useState(false);

  const deleteUser = async () => {
    const curUserId = user.id;
    const deleteUserQuery = `
    mutation deleteUser($userId: String!) {
      deleteUser(userId: $userId)
    }
    `;
    const variables = {
      userId: curUserId,
    };
    await request(deleteUserQuery, REQ_METHOD.MUTATION, variables);
    await AsyncStorage.clear();
    navigation.replace('LoginMain');
  };

  const requestUsernameChange = async () => {
    dispatch(updateIsLoadingAction(true));
    const updateUserVariables = {
      updateUserInput: {
        username: nickname,
      },
    };

    const updateUserQuery = `
        mutation updateUser($updateUserInput: UpdateUserInput!) {
            updateUser(userInput: $updateUserInput) {
              username
        }
    }`;

    try {
      const res = await request(
        updateUserQuery,
        REQ_METHOD.MUTATION,
        updateUserVariables,
      );

      const newUserName = res?.data.data.updateUser.username;
      dispatch(updateUsernameAction(newUserName));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(updateIsLoadingAction(false));
      setIsPressedChangeNickname(false);
    }
  };

  return (
    <>
      <Modal
        visible={isPressedDeleteUser}
        transparent
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          display: isPressedDeleteUser ? 'flex' : 'none',
        }}>
        <View style={styles.modalContainer} />
        <View style={styles.popupContainer}>
          <Text
            style={{
              color: colors.white,
              alignSelf: 'center',
              paddingTop: 5,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            정말로 탈퇴하시겠어요?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingBottom: 10,
            }}>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => setIsPressedDeleteUser(!isPressedDeleteUser)}>
              <Text style={{color: colors.white}}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={deleteUser}>
              <Text style={{color: colors.white}}>탈퇴</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isPressedChangeNickname}
        transparent
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          display: isPressedChangeNickname ? 'flex' : 'none',
        }}>
        <View style={styles.modalContainer} />
        <View style={{...styles.popupContainer, height: 120}}>
          <Text
            style={{
              color: colors.white,
              alignSelf: 'center',
              paddingVertical: 5,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            유저네임 변경
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={value => setNickname(value)}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 10,
            }}>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() => {
                setNickname('');
                setIsPressedChangeNickname(!isPressedChangeNickname);
              }}>
              <Text style={{color: colors.white}}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={requestUsernameChange}>
              <Text style={{color: colors.white}}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Header
          onPressBack={() => navigation.goBack()}
          color={colors.white}
          buttonColor={colors.coral1}
        />
        <View style={styles.containter}>
          <Text style={styles.heading}>프로필</Text>
          <View style={{paddingHorizontal: 24}}>
            <View style={styles.profileWrapper}>
              <TouchableOpacity
                onPress={() => {
                  // change profile picture on press
                }}>
                <View>
                  <Image
                    alt="Profile picture"
                    source={assets.images.default_profile}
                    style={styles.profileImage}
                  />
                </View>
              </TouchableOpacity>
              <View style={{flex: 1}} />
              <View style={styles.profile}>
                <Text style={styles.profileName}>{user.username}</Text>
                {/* <Text style={styles.profileUserID}>{addr}</Text> */}
                {/* <Text style={styles.profileUserID}>가입일: 2023.06.30</Text> */}
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>프로필 설정</Text>
            <TouchableOpacity
              style={styles.row}
              onPress={() => {
                setIsPressedChangeNickname(true);
              }}>
              <Ionicons name="person-outline" size={18} />
              <Text style={styles.rowText}>유저네임</Text>
              <View style={{flex: 1}} />
              <Text style={{fontSize: 17, color: '#0c0c0c'}}>
                {user.username}
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                size={18}
                color={'#0c0c0c'}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.row} onPress={toggleEditAddr}>
              <Ionicons name="navigate-outline" size={18} />
              <Text style={styles.rowText}>주소</Text>
              <View style={{flex: 1}} />
              <TextInput
                keyboardType="default"
                style={styles.input}
                placeholder="서울시 중구 길동로 32"
                placeholderTextColor="grey"
                selectionColor="black"
                editable={isEditAddr}
                onEndEditing={() => {
                  setIsEditAddr(false);
                  // TODO: change nickname text onEndEditing
                }}
                onChangeText={text => setAddr(text)}
              />
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.row}>
              <Ionicons name="lock-closed-outline" size={18} />
              <Text style={styles.rowText}>비밀번호 변경</Text>
              <View style={{flex: 1}} />
              <Ionicons
                name="chevron-forward-outline"
                color="#0c0c0c"
                size={22}
              />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.delete}
              onPress={() => {
                setIsPressedDeleteUser(true);
              }}>
              <Text style={styles.deleteText}>탈퇴하기</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate('SettingsMain');
            }}>
            <View style={styles.row}>
              <Text style={styles.rowText}>계정 관리</Text>
              <View style={{flex: 1}} />
              <Ionicons
                name="chevron-forward-outline"
                color="#0c0c0c"
                size={22}
              />
            </View>
          </TouchableOpacity> */}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  containter: {
    paddingBottom: 24,
  },
  modalContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'grey',
    opacity: 0.85,
    zIndex: 10000,
    justifyContent: 'center',
  },
  popupContainer: {
    position: 'absolute',
    zIndex: 10000,
    top: Dimensions.get('window').height / 2 - 50,
    alignSelf: 'center',
    backgroundColor: colors.coral1,
    width: 200,
    height: 100,
    padding: 10,
    paddingTop: 15,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  profileWrapper: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: colors.coral1,
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  profileUserID: {
    marginTop: 5,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2f2',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  rowText: {
    fontSize: 17,
    color: '#0c0c0c',
    marginLeft: 5,
  },
  rowResultText: {
    fontSize: 16,
    color: '#989898',
  },
  input: {
    // color: '#989898',
    color: 'white',
    // borderBottomColor: '#eee',
    fontSize: 16,
    textAlign: 'left',
    borderColor: colors.coral2,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  delete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: colors.red,
    borderRadius: 8,
    marginTop: 15,
  },
  deleteText: {
    fontSize: 17,
    color: colors.white,
    fontWeight: 'bold',
  },
});
