import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  Linking,
  View,
} from 'react-native';
import colors from '../styles/colors';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';

export default function Muckiters() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const DeveloperInfoBox = ({name, role, instagram, desc}) => (
    <View style={styles.developerBox}>
      <Text style={styles.question}>{name}</Text>
      <Text style={styles.answer}>{role}</Text>
      <Text style={styles.answer}>
        {desc}
        {'\n'}
        {'\n'}
        Instagram:{' '}
        <Text
          style={{color: colors.coral1, textDecorationLine: 'underline'}}
          onPress={() => openInstagramProfile(instagram)}>
          @{instagram}
        </Text>
      </Text>
    </View>
  );
  const openInstagramProfile = instagramUsername => {
    const instagramURL = `https://www.instagram.com/${instagramUsername}`;
    Linking.openURL(instagramURL);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Header
        onPressBack={() => navigation.goBack()}
        color={colors.white}
        buttonColor={colors.coral1}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>개발자 정보</Text>

        {/* Developer 1: Ji Won Yoon */}
        <DeveloperInfoBox
          name="Ji Won Yoon 🧑‍💻"
          role="Lead Backend Engineer"
          instagram="g1_59"
          desc="서비스 기획부터 Kubernetes 배포까지, 서버쪽 인프라 구성과 API를 담당하고 있습니다."
        />

        {/* Developer 2: Woonggyu Jin */}
        <DeveloperInfoBox
          name="Woonggyu Jin 👦🏻"
          role="Lead Frontend Engineer"
          instagram="woonggyujin_"
          desc="서비스 기획, UI/UX 개발, 백엔드 API와의 통합, 프론트엔드 아키텍처 기획 및 성능 개선을 담당하고 있습니다."
        />

        <DeveloperInfoBox
          name="Changmin Shin 🙋🏻‍♂️"
          role="Frontend Engineer"
          instagram="ge419p"
          desc="UI/UX 개발을 담당하고 있습니다."
        />

        {/* Developer 3: Changmin Shin */}
        {/* <DeveloperInfoBox name="Changmin Shin 🙋‍♂️" role="Frontend Engineer" instagram="changmin_shin" /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.coral1,
    marginBottom: 16,
    textAlign: 'left',
    paddingHorizontal: 16,
  },
  developerBox: {
    borderWidth: 1,
    borderColor: colors.coral1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 10,
    marginHorizontal: 16,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
    textAlign: 'left',
  },
  answer: {
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    textAlign: 'left',
  },
});
