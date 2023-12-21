/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ScreenParamList} from '../types/navigation';
import assets from '../../assets';
import colors from '../styles/colors';
import {REQ_METHOD, request} from '../controls/RequestControl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Linking, Platform} from 'react-native';

export default function Settings() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();

  const logout = async () => {
    try {
      const logoutQuery = `
        mutation logout() {
          logout()
        }
      `;
      const variables = {};
      await request(logoutQuery, REQ_METHOD.MUTATION, variables);
      await AsyncStorage.clear();
      // await AsyncStorage.clear();
      // navigation.replace('SplashScreen');
    } catch (e) {
      console.log(e);
    }
  };

  const openSettings = () => {
    const url =
      //TODO: add Android support
      Platform.OS === 'ios' ? 'app-settings:' : 'package:your.app.package';
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Can't handle settings URL");
      }
    });
  };

  const sendEmail = () => {
    const to = 'example@email.com';
    const subject = 'Muckit 기능 문의';
    const body = '문의 내용을 적어주세요!';
    const url = `mailto:${to}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('이메일 앱을 찾을수가 없어요!');
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.containter}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 30,
            }}>
            <Text style={styles.heading}>설정</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{paddingHorizontal: 24}}
          onPress={() => {
            navigation.navigate('ProfileMain');
          }}>
          <View style={styles.profileWrapper}>
            <TouchableOpacity
              onPress={() => {
                // profile picture on press
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
              <Text style={styles.profileName}>홍길동</Text>
              <Text style={styles.profileUserID}>@matzip-user-01</Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* <View style={styles.section}>
          <Text style={styles.sectionHeader}>프로필 설정</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>이름/닉네임</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>비밀번호</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>연결된 계정</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>주소</Text>
          </View>
        </View> */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>알림</Text>
          <View style={styles.row}>
            <Ionicons name="notifications-outline" size={18} />
            <Text style={styles.rowText}>푸시 알림 활성화</Text>
            <View style={{flex: 1}} />
            <TouchableOpacity onPress={openSettings}>
              <Ionicons name="settings-outline" size={18} />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Ionicons name="earth-outline" size={18} />
            <Text style={styles.rowText}>위치 기반 푸시 알림 활성화</Text>
            <View style={{flex: 1}} />
            <TouchableOpacity onPress={openSettings}>
              <Ionicons name="settings-outline" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>도움말</Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Help');
            }}
            style={styles.row}>
            <Ionicons name="information-circle-outline" size={18} />
            <Text style={styles.rowText}>앱 사용법</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FAQ');
            }}
            style={styles.row}>
            <Ionicons name="help-circle-outline" size={18} />
            <Text style={styles.rowText}>자주 물어보는 질문</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>지원</Text>
          <View style={styles.row}>
            <Ionicons name="construct-outline" size={18} />
            <Text style={styles.rowText}>버전 정보</Text>
            <View style={{flex: 1}} />
            <Text>0.0.1</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="newspaper-outline" size={18} />
            <Text style={styles.rowText}>서비스 약관 및 방침</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </View>
          <View style={styles.row}>
            <Ionicons name="bug-outline" size={18} />
            <Text style={styles.rowText}>버그 신고</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </View>
          <TouchableOpacity onPress={sendEmail} style={styles.row}>
            <Ionicons name="mail-outline" size={18} />
            <Text style={styles.rowText}>문의하기</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 60}}>
          <TouchableOpacity
            style={styles.logout}
            onPress={() => {
              logout();
            }}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
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
    marginBottom: 0,
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  profileWrapper: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: colors.coral1,
    borderRadius: 20,
    marginBottom: 25,
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
    // marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    // backgroundColor: 'white',
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
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: 'red',
    borderRadius: 8,
    marginTop: 15,
  },
  logoutText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
});
