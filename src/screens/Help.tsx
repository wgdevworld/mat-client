import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  Switch,
} from 'react-native';
import assets from '../../assets';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors'; 



export default function Helps() {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <ScrollView contentContainerStyle={styles.containter}>
                <Text style={styles.heading}>
                        다양한 기능
                </Text>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>나의 맛집 리스트 만들기</Text>
                    <Text style={styles.step}>
                        Step 1: 맛집 검색
                    </Text>
                    <Text style={styles.instruction}>
                        Log in using your new ID and PW.
                    </Text>
                    <Text style={styles.step}>
                        Step 2: 맛집 추가
                    </Text>
                    <Text style={styles.instruction}>
                        Log in using your new ID and PW.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>주변 맛집 검색</Text>
                    <Text style={styles.step}>
                        Step 1: 위치 정보 공유 허용
                    </Text>
                    <Text style={styles.instruction}>
                        Log in using your new ID and PW.
                    </Text>
                    <Text style={styles.step}>
                        Step 2: 알림 허용
                    </Text>
                    <Text style={styles.instruction}>
                        Log in using your new ID and PW.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>맛집 리스트 구독</Text>
                    <Text style={styles.step}>
                        Step 1: 다양한 맛집 리스트 보기
                    </Text>
                    <Text style={styles.instruction}>
                        Log in using your new ID and PW.
                    </Text>
                    <Text style={styles.step}>
                        Step 2: 친구의 맛집 리스트 구독하기
                    </Text>
                    <Text style={styles.instruction}>
                        Log in using your new ID and PW.
                    </Text>
                    <Text style={styles.step}>
                        Step 3: 구독한 맛집 리스트 알림 받기
                    </Text>
                    <Text style={styles.instruction}>
                        Log in using your new ID and PW.
                    </Text>
                </View>
            
            </ScrollView>
        </SafeAreaView>
    )    
}
const styles = StyleSheet.create({
    containter: {
      paddingVertical: 24,
    },
    heading: {
      fontSize: 30,
      fontWeight: 'bold',
      color: colors.coral1,
      marginBottom: 35,
      textAlign: 'left',
      paddingHorizontal: 24,
    },
    step: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
        textAlign: 'left',
        paddingHorizontal: 24,
    },
    instruction: {
        fontSize: 17,
        color: 'black',
        marginBottom: 20,
        textAlign: 'left',
        paddingHorizontal: 24,
    },
    section: {
      paddingHorizontal: 24,
      backgroundColor: '#f2f2f2f2',
      marginBottom: 15,
    },
    sectionHeader: {
      paddingVertical: 12,
      fontSize: 15,
      fontWeight: 'bold',
      color: colors.coral1,
      textTransform: 'uppercase',
      letterSpacing: 1.1,
      marginBottom: 15,
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
});