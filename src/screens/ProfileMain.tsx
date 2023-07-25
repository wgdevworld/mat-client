/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';

export default function ProfileMain() {
  const [isEdit, setIsEdit] = React.useState(false);
  const toggleEdit = () => setIsEdit(true);
  const [nickname, setNickname] = React.useState('홍길동');
  const [isEditAddr, setIsEditAddr] = React.useState(false);
  const toggleEditAddr = () => setIsEditAddr(true);
  const [addr, setAddr] = React.useState('서울시 중구 길동로 32');
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={styles.containter}>
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
              <Text style={styles.profileName}>{nickname}</Text>
              <Text style={styles.profileUserID}>@matzip-user-01</Text>
              <Text style={styles.profileUserID}>{addr}</Text>
              {/* <Text style={styles.profileUserID}>가입일: 2023.06.30</Text> */}
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>프로필 설정</Text>
          <TouchableOpacity style={styles.row} onPress={toggleEdit}>
            <Ionicons name="person-outline" size={18} />
            <Text style={styles.rowText}>닉네임</Text>
            <View style={{flex: 1}} />
            <TextInput
              keyboardType="default"
              style={styles.input}
              placeholder="현재 닉네임"
              placeholderTextColor="grey"
              selectionColor="black"
              editable={isEdit}
              onEndEditing={() => {
                setIsEdit(false);
                // TODO: change nickname text onEndEditing
              }}
              onChangeText={text => setNickname(text)}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={toggleEditAddr}>
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
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Ionicons name="lock-closed-outline" size={18} />
            <Text style={styles.rowText}>비밀번호 변경</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.delete}
            onPress={() => {
              // to backend, to login screen
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
  profileWrapper: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#FF4000',
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
    color: '#989898',
    // borderBottomColor: '#eee',
    fontSize: 16,
    textAlign: 'right',
  },
  delete: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: 'grey',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  deleteText: {
    fontSize: 17,
    color: 'red',
    fontWeight: 'bold',
  },
});
