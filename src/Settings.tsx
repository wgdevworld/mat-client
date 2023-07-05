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
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// implement profile picture later
const PROFILE_PICTURE = '../assets/image/default_profile.png';

export default function Settings() {
  const [isPush, setIsPush] = React.useState(true);
  const togglePush = () => setIsPush(prev => !prev);
  const [isLocPush, setIsLocPush] = React.useState(true);
  const toggleLocPush = () => setIsLocPush(prev => !prev);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FF4000'}}>
      <ScrollView contentContainerStyle={styles.containter}>
        <Text style={styles.heading}>설정</Text>
        <TouchableOpacity
          style={{paddingHorizontal: 24}}
          onPress={() => {
            // move to profile settings page
          }}>
          <View style={styles.profileWrapper}>
            <TouchableOpacity
              onPress={() => {
                // profile picture on press
              }}>
              <View>
                <Image
                  alt="Profile picture"
                  source={require(PROFILE_PICTURE)}
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
            <Text style={styles.rowText}>푸시 알림 활성화</Text>
            <View style={{flex: 1}} />
            <Switch onValueChange={togglePush} value={isPush} />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>위치 기반 푸시 알림 활성화</Text>
            <View style={{flex: 1}} />
            <Switch onValueChange={toggleLocPush} value={isLocPush} />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>팔로우</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>팔로우한 유저</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>팔로우한 지도</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>도움말</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>앱 사용법</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>자주 물어보는 질문</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>지원</Text>
          <View style={styles.row}>
            <Text style={styles.rowText}>버전 정보</Text>
            <View style={{flex: 1}} />
            <Text>0.0.1</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>서비스 약관 및 방침</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>버그 신고</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>문의하기</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </View>
        </View>
        <View style={{paddingHorizontal: 60}}>
          <TouchableOpacity style={styles.logout}>
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
    color: 'white',
    marginBottom: 20,
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  profileWrapper: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#f2f2f2f2',
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
    // marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: '#414d63',
    textAlign: 'center',
    // backgroundColor: 'white',
  },
  profileUserID: {
    marginTop: 5,
    fontSize: 16,
    color: '#989898',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
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
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: 'grey',
    borderRadius: 8,
    marginTop: 15,
  },
  logoutText: {
    fontSize: 17,
    color: 'red',
    fontWeight: 'bold',
  },
});
