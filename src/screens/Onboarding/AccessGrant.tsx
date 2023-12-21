import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import colors from '../../styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../../types/navigation';

const ICON_SIZE = 50;

export default function AccessGrant() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const handleNext = () => {
    navigation.navigate('Survey1');
  };
  const locIcon = (
    <Ionicons
      name="location-outline"
      size={ICON_SIZE}
      color="black"
    />
  );

  const notifIcon = (
    <Ionicons
      name="notifications-outline"
      size={ICON_SIZE}
      color="black"
    />
  );
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>앱 사용을 위해 {'\n'}접근 권한을 허용해주세요.</Text>
      <Text style={styles.redtitle}>선택적 접근 권한</Text>
      
      <View style={styles.textContainer}>
        <View style={styles.iconContainer}>
          {locIcon}
        </View>
        <View style={styles.textInnerContainer}>
          <Text style={styles.subtitle}>위치</Text>
          <Text style={styles.detail}>현재 위치 주변에 맛집을 찾을 수{'\n'}
          있도록 위치정보 접근 설정을{'\n'}
          <Text style={styles.boldText}>항상 허용</Text>으로 변경해주세요.</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <View style={styles.iconContainer}>
          {notifIcon}
        </View>
        <View style={styles.textInnerContainer}>
          <Text style={styles.subtitle}>알림</Text>
          <Text style={styles.detail}>근처에 맛집이 있을 때 알림을{'\n'}
          받을 수 있도록 알림 설정을{'\n'}<Text style={styles.boldText}>허용</Text>으로 변경해주세요.</Text>
        </View>
      </View>
      <View>
        <Text style={styles.sentence}>허용에 동의하지 않으셔도 먹킷을 이용하실 수 있으나, 일부 서비스의 사용이 제한될 수 있습니다. ‘설정 > 먹킷’에서 접근권한 변경이 가능합니다. </Text>
      </View>
      <TouchableOpacity 
        style={styles.startButton}
        onPress={handleNext}>
        <Text style={styles.buttonText}>계속</Text>
      </TouchableOpacity>
      <View style={styles.progressIndicator}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={[
              styles.stepMarker,
              step === 1 && styles.currentStepMarker, 
            ]}
          />
        ))}
      </View>
    </View>
  );  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    paddingHorizontal: 40,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop:100,
    marginBottom: 40,
    //paddingHorizontal: 30,
  },
  redtitle: {
    fontSize: 18,
    textAlign: 'left',
    alignSelf: 'flex-start',
    //paddingHorizontal: 30,
    color: colors.coral1,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  iconContainer: {
    width: ICON_SIZE,
    alignItems: 'center',
  },
  textInnerContainer: {
    flex: 1,
    marginLeft: 23,
  },
  subtitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 17,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black', 
  },
  sentence: {
    fontSize: 14,
    marginTop: 40,
    color: 'gray',
  },
  startButton: {
    backgroundColor: colors.coral1,
    width: 330,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    position: 'absolute',
    top: '80%',
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '90%',
    marginTop: 10,
  },
  stepMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'lightgray',
  },
  currentStepMarker: {
    backgroundColor: colors.coral1,
  },
});


