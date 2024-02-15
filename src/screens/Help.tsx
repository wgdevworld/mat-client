import React from 'react';
import {SafeAreaView, StyleSheet, Text, ScrollView, View} from 'react-native';
import colors from '../styles/colors';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';

export default function Helps() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Header
        onPressBack={() => navigation.goBack()}
        color={colors.white}
        buttonColor={colors.coral1}
      />
      <ScrollView
        contentContainerStyle={styles.containter}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>앱 사용법</Text>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>주변 맛집 검색 및 저장하기</Text>
          <Text style={styles.step}>Step 1: 위치 정보 공유 허용</Text>
          <Text style={styles.instruction}>
            실시간으로 정확한 맛집 정보를 받아볼 수 있도록 "항상 허용"으로
            설정해 주세요.
          </Text>
          <Text style={styles.step}>Step 2: 주변 맛집 검색</Text>
          <Text style={styles.instruction}>
            메인 화면에서 상단의 검색창을 이용해 원하는 맛집을 검색해 볼 수
            있어요. 나만의 맛맵에 저장하고 싶은 맛집이 있다면 우측 상단에 위치한
            더하기 버튼을 눌러주세요.
          </Text>
          <Text style={styles.step}>Step 3: 주변 맛집 리스트</Text>
          <Text style={styles.instruction}>
            하단의 "근처 나의 맛집들" 탭을 위로 올리면 다양한 맛집과 상세 주소,
            나와의 거리, 별점, 리뷰를 볼 수 있어요.
          </Text>
          <Text style={styles.step}>Step 4: 주변 맛집 저장</Text>
          <Text style={styles.instruction}>
            "근처 나의 맛집들" 중 원하는 맛집을 클릭하면 상세페이지로 이동할 수
            있어요. 이름 옆 체크 표시 버튼을 통해 쉽게 방문 여부를 기록할 수
            있어요.
          </Text>
          <Text style={styles.step}>Step 5: 주변 맛집 리뷰</Text>
          <Text style={styles.instruction}>
            상세페이지 하단에서 다른 사용자들이 작성한 리뷰를 볼 수 있고, 직접
            별점 및 리뷰를 등록할 수 있어요.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>맛맵 구독</Text>
          <Text style={styles.step}>Step 1: 맛맵 모음집으로 이동</Text>
          <Text style={styles.instruction}>
            하단 메뉴에서 두번째 탭을 선택하세요.
          </Text>
          <Text style={styles.step}>Step 2: 다양한 맛맵들 보기</Text>
          <Text style={styles.instruction}>
            유튜브, 인스타 등에서 소개된 맛집들이 각각의 리스트로 정리되어
            한눈에 볼 수 있어요. 다른 유저들이 만든 맛맵도 확인해보세요!
          </Text>
          <Text style={styles.step}>Step 3: 맛맵 팔로우하기</Text>
          <Text style={styles.instruction}>
            관심 있는 맛맵이 있다면 팔로우 버튼을 눌러 구독할 수 있어요.
            팔로우한 맛맵은 하단 메뉴 첫번째 탭 드롭다운 메뉴에서 확인해볼 수
            있어요.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>나만의 먹킷리스트 만들기</Text>
          <Text style={styles.step}>Step 1: 나만의 먹킷리스트로 이동</Text>
          <Text style={styles.instruction}>
            하단 메뉴에서 세번째 탭을 선택하세요.
          </Text>
          <Text style={styles.step}>Step 2: 먹킷리스트 추가</Text>
          <Text style={styles.instruction}>
            꼭 먹고 싶은 메뉴를 입력한 후 키보드의 "완료" 버튼을 눌러 새로운
            먹킷을 추가하세요.
          </Text>
          <Text style={styles.step}>Step 3: 먹킷리스트 기록</Text>
          <Text style={styles.instruction}>
            각 먹킷 우측에 있는 동그라미 버튼을 눌러서 먹킷리스트 진행 과정을
            기록해 보세요. 먹킷을 삭제 하고 싶다면 왼쪽으로 스와이프 해보세요!
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>주변 맛집 알림 받기</Text>
          <Text style={styles.step}>Step 1: 위치 정보 공유 및 알림 허용</Text>
          <Text style={styles.instruction}>
            실시간으로 정확한 맛집 정보를 받아볼 수 있도록 "허용"으로 설정해
            주세요.
          </Text>
          <Text style={styles.step}>Step 2: 주변 맛집 알림</Text>
          <Text style={styles.instruction}>
            쉽고 빠른 맛집 찾기를 위해 현재 사용자의 위치 주변에 맛집이 있을
            경우, 자동으로 알림이 가요!
          </Text>
        </View>
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
