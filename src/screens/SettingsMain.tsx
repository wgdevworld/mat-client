/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import colors from '../styles/colors';
import {REQ_METHOD, request} from '../controls/RequestControl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Linking, Platform} from 'react-native';
import {ScreenParamList} from '../types/navigation';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {ASYNC_STORAGE_ENUM} from '../types/asyncStorage';
import {
  updateIsLoadingAction,
  updateIsReceiveNotifications,
} from '../store/modules/globalComponent';
import Slider from '@react-native-community/slider';
import BackgroundGeolocation from 'react-native-background-geolocation';

export default function Settings() {
  const user = useAppSelector(state => state.user);
  const isRefuseNotifications = useAppSelector(
    state => state.globalComponents.isRefuseNotifications,
  );
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const [isSetRadiusModalVisible, setIsSetRadiusModalVisible] = useState(false);
  const [radius, setRadius] = useState(1000);
  const [isSetIntervalModalVisible, setIsSetIntervalModalVisible] =
    useState(false);
  const [interval, setInterval] = useState(3);
  const dispatch = useAppDispatch();

  const logout = async () => {
    try {
      const logoutQuery = `
        mutation {
          logout
        }
      `;
      const variables = {};
      await request(logoutQuery, REQ_METHOD.MUTATION, variables);
      await AsyncStorage.clear();
      await AsyncStorage.setItem(ASYNC_STORAGE_ENUM.IS_ONBOARDING_DONE, 'true');
      BackgroundGeolocation.stop();
      navigation.replace('LoginMain');
    } catch (e) {
      console.log(e);
    }
  };

  const updateNotificationRadius = async () => {
    dispatch(updateIsLoadingAction(true));
    await AsyncStorage.setItem(
      ASYNC_STORAGE_ENUM.NOTIFICATION_RADIUS,
      radius.toString(),
    );
    await BackgroundGeolocation.setConfig({
      stationaryRadius: radius / 5,
      distanceFilter: radius / 2,
    }).then(state => {
      console.log('[setConfig] success: ', state);
    });
    dispatch(updateIsLoadingAction(false));
    setIsSetRadiusModalVisible(false);
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
    const to = 'kobonmat@gmail.com';
    const subject = 'Muckit 기능 문의';
    const body = '문의 내용을 적어주세요!';
    const url = `mailto:${to}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          Alert.alert('이메일 앱이 설치 되어있는지 확인해주세요!');
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Modal
        visible={isSetIntervalModalVisible}
        transparent
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          display: isSetIntervalModalVisible ? 'flex' : 'none',
        }}>
        <View style={styles.modalContainer} />
        <View style={styles.popupContainer}>
          <Text
            style={{
              color: colors.white,
              fontSize: 20,
              alignSelf: 'center',
              paddingBottom: 6,
              fontWeight: 'bold',
            }}>
            알림 간격
          </Text>
          <Text
            style={{
              color: colors.white,
              fontSize: 14,
              paddingBottom: 6,
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            {interval !== 0
              ? `${interval}시간동안 같은 식당에\n 대한 알림을 받지 않기`
              : '모든 근처 맛집 \n알림을 항상 받기'}
          </Text>
          <Slider
            style={{width: '100%', height: 40}}
            minimumValue={3}
            maximumValue={24}
            step={1}
            value={interval}
            onValueChange={value => setInterval(value)}
            minimumTrackTintColor={colors.coral2}
            maximumTrackTintColor={'white'}
            thumbTintColor="#b9e4c9"
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
                setIsSetIntervalModalVisible(false);
              }}>
              <Text style={{color: colors.white}}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={async () => {
                await AsyncStorage.setItem(
                  ASYNC_STORAGE_ENUM.NOTIFICATION_INTERVAL,
                  interval.toString(),
                );
                setIsSetIntervalModalVisible(false);
              }}>
              <Text style={{color: colors.white}}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isSetRadiusModalVisible}
        transparent
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          display: isSetRadiusModalVisible ? 'flex' : 'none',
        }}>
        <View style={styles.modalContainer} />
        <View style={styles.popupContainer}>
          <Text
            style={{
              color: colors.white,
              fontSize: 20,
              alignSelf: 'center',
              paddingBottom: 6,
              fontWeight: 'bold',
            }}>
            알림 반경
          </Text>
          <Text
            style={{
              color: colors.white,
              fontSize: 14,
              paddingBottom: 6,
              alignSelf: 'center',
              textAlign: 'center',
            }}>
            {`저장한 식당이 최대 ${radius}m \n근처에 있으면 알림 받기`}
          </Text>
          <Slider
            style={{width: '100%', height: 40}}
            minimumValue={1000}
            maximumValue={3000}
            step={100}
            value={radius}
            onValueChange={value => setRadius(value)}
            minimumTrackTintColor={colors.coral2}
            maximumTrackTintColor={'white'}
            thumbTintColor="#b9e4c9"
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 10,
            }}>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={() =>
                setIsSetRadiusModalVisible(!isSetRadiusModalVisible)
              }>
              <Text style={{color: colors.white}}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: 'center'}}
              onPress={updateNotificationRadius}>
              <Text style={{color: colors.white}}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
              <Text style={styles.profileName}>{user.username}</Text>
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
          <Text style={{...styles.sectionHeader, paddingTop: 0}}>
            가본 맛집
          </Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('VisitedZips')}>
            <Ionicons name="restaurant-outline" size={18} />
            <Text style={styles.rowText}>내가 가본 맛집</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>어플 설정</Text>
          <TouchableOpacity style={styles.row} onPress={openSettings}>
            <Ionicons name="navigate-circle-outline" size={18} />
            <Text style={styles.rowText}>위치 권한 설정</Text>
            <View style={{flex: 1}} />
            <Ionicons name="settings-outline" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={async () => {
              const userSetRadius = await AsyncStorage.getItem(
                ASYNC_STORAGE_ENUM.NOTIFICATION_RADIUS,
              );
              setRadius(userSetRadius ? parseInt(userSetRadius, 10) : 2000);
              setIsSetRadiusModalVisible(true);
            }}>
            <Ionicons name="radio-outline" size={18} />
            <Text style={styles.rowText}>근처 맛집 알림 반경</Text>
            <View style={{flex: 1}} />
            <Ionicons name="settings-outline" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={async () => {
              const userSetInterval = await AsyncStorage.getItem(
                ASYNC_STORAGE_ENUM.NOTIFICATION_INTERVAL,
              );
              setInterval(userSetInterval ? parseInt(userSetInterval, 10) : 6);
              setIsSetIntervalModalVisible(true);
            }}>
            <Ionicons name="timer-outline" size={18} />
            <Text style={styles.rowText}>근처 맛집 알림 간격</Text>
            <View style={{flex: 1}} />
            <Ionicons name="settings-outline" size={18} />
          </TouchableOpacity>
          <View style={{...styles.row, paddingRight: 5}}>
            <Ionicons name="phone-portrait-outline" size={18} />
            <Text style={styles.rowText}>근처 맛집 알림 받기</Text>
            <View style={{flex: 1}} />
            <Switch
              thumbColor={'white'}
              trackColor={{
                false: 'grey',
                true: colors.coral1,
              }}
              onValueChange={() => {
                if (!isRefuseNotifications) {
                  BackgroundGeolocation.stop();
                } else {
                  BackgroundGeolocation.start();
                }
                dispatch(updateIsReceiveNotifications(!isRefuseNotifications));
              }}
              value={!isRefuseNotifications}
              style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
              ios_backgroundColor={colors.grey}
            />
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
            <Text>1.1.1</Text>
          </View>
          {/* <View style={styles.row}>
            <Ionicons name="newspaper-outline" size={18} />
            <Text style={styles.rowText}>서비스 약관 및 방침</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </View> */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Muckiters');
            }}
            style={styles.row}>
            <Ionicons name="reader-outline" size={18} />
            <Text style={styles.rowText}>개발자 정보</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </TouchableOpacity>
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
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
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
    width: 250,
    padding: 10,
    paddingTop: 15,
    borderRadius: 10,
    justifyContent: 'space-between',
  },
});
