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

const ICON_SIZE = 60;

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
      
      <View style={styles.iconsContainer1}>
        {locIcon}
      </View>
      <Text style={styles.subtitle1}>위치</Text>
      <Text style={styles.detail1}>현재 위치 주변에 맛집을 찾을 수 있도록 위치정보 접근 설정을 항상 허용으로 변경해주세요.</Text>
      <View style={styles.iconsContainer2}>
        {notifIcon}
      </View>
      <Text style={styles.subtitle2}>알림</Text>
      <Text style={styles.detail2}>근처에 맛집이 있을 때 알림을 받을 수 있도록 알림 설정을 허용으로 변경해주세요.</Text>
  
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
    marginTop: 70,
    marginBottom: 40,
    //paddingHorizontal: 30,
  },
  redtitle: {
    fontSize: 18,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 20,
    //paddingHorizontal: 30,
    color: colors.coral1,
  },
  iconsContainer1: {
    alignSelf: 'flex-start',
    //paddingHorizontal: 30,
  },
  iconsContainer2: {
    alignSelf: 'flex-start',
    //paddingHorizontal: 30,
  },
  subtitle1: {
    fontSize: 23,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginLeft: 90,
    fontWeight: 'bold',
  },
  subtitle2: {
    fontSize: 23,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginLeft: 90,
    fontWeight: 'bold',
  },
  detail1: {
    fontSize: 17,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginLeft: 90,
  },
  detail2: {
    fontSize: 17,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginLeft: 90,
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


