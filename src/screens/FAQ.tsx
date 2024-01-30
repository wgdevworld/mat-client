import React from 'react';
import {SafeAreaView, StyleSheet, Text, ScrollView} from 'react-native';
import colors from '../styles/colors';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';

export default function FAQs() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Header
        onPressBack={() => navigation.goBack()}
        color={colors.white}
        buttonColor={colors.coral1}
      />
      <ScrollView contentContainerStyle={styles.containter}>
        <Text style={styles.heading}>자주 물어보는 질문</Text>

        <Text style={styles.question}>Q: 먹킷을 어떻게 활용할 수 있나요?</Text>
        <Text style={styles.answer}>
          A: SNS, 공중파 방송, 인터넷 검색 등 방대한 맛집 정보를 간편하게 한곳에
          모아보기 뿐만 아니라, 나의 현재 위치 주변 맛집에 대한 알림을 받아 볼
          수 있어요. 간편하게 맛집 검색 및 저장이 가능하고, 나만의 맛집
          버킷리스트를 만들 수 있어요.
        </Text>
        <Text style={styles.question}>
          Q: 위치 공유 및 알림 허용 설정이 왜 필요한가요?
        </Text>
        <Text style={styles.answer}>
          A: 사용자의 현재 위치를 기반으로 주변 맛집 실시간 알림 및 검색이
          가능하기 때문에, 위치 공유 및 알림 설정을 허용해야 먹킷을 100% 활용할
          수 있어요!
        </Text>
        <Text style={styles.question}>Q: 먹킷의 사용법이 궁금해요!</Text>
        <Text style={styles.answer}>
          A: 설정 - 도움말 - 앱 사용법을 참고해 주세요.
        </Text>
        <Text style={styles.question}>
          Q: 닉네임 변경 및 탈퇴는 어떻게 하나요?
        </Text>
        <Text style={styles.answer}>
          A: "설정"에서 상단 프로필 카드를 클릭하면 "프로필 설정" 화면에서
          닉네임 변경 및 탈퇴가 가능해요.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  containter: {
    paddingBottom: 24,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.coral1,
    marginBottom: 35,
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  answer: {
    fontSize: 17,
    color: 'black',
    marginBottom: 20,
    textAlign: 'left',
    paddingHorizontal: 24,
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
});
