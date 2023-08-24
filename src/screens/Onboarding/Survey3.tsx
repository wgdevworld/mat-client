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
import colors from '../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../../types/navigation';

export default function Survey3() {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();


  const handleNext = () => {
    navigation.navigate('Welcome');
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>MUKIT을 주로 어떻게 활용하시나요?</Text>
      <TouchableOpacity
        style={[
          styles.optionBox,
          selectedOption === '나만의 먹킷 리스트 만들기' && styles.selectedOptionBox,
        ]}
        onPress={() => handleOptionSelect('나만의 먹킷 리스트 만들기')}
      >
        <Text style={styles.optionText}>나만의 먹킷 리스트 만들기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionBox,
          selectedOption === '나의 먹킷 리스트 공유하기' && styles.selectedOptionBox,
        ]}
        onPress={() => handleOptionSelect('나의 먹킷 리스트 공유하기')}
      >
        <Text style={styles.optionText}>나의 먹킷 리스트 공유하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionBox,
          selectedOption === '먹킷 리스트 구독하기' && styles.selectedOptionBox,
        ]}
        onPress={() => handleOptionSelect('먹킷 리스트 구독하기')}
      >
        <Text style={styles.optionText}>먹킷 리스트 구독하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionBox,
          selectedOption === '주변 맛집 알림 받기' && styles.selectedOptionBox,
        ]}
        onPress={() => handleOptionSelect('주변 맛집 알림 받기')}
      >
        <Text style={styles.optionText}>주변 맛집 알림 받기</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.nextButton,
          !selectedOption && styles.disabledNextButton, // Apply additional style for disabled button
        ]}
        onPress={handleNext}
        disabled={!selectedOption} // Disable the button if no option is selected
      >
        <Text style={styles.nextButtonText}>계속</Text>
      </TouchableOpacity>

      <View style={styles.progressIndicator}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={[
              styles.stepMarker,
              step === 4 && styles.currentStepMarker, 
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
    marginTop: 190,
    paddingHorizontal: 20,
  },
  question: {
    fontSize: 20,
    marginBottom: 50,
    fontWeight: 'bold',
  },
  optionBox: {
    width: 330,
    height: 50,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderRadius: 5,
  },
  selectedOptionBox: {
    backgroundColor: 'gray', 
  },
  optionText: {
    fontSize: 20,
    color: 'black',
  },
  nextButton: {
    backgroundColor: colors.coral1,
    width: 330,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    position: 'absolute',
    top: '80%',
  },
  nextButtonText: {
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
  disabledNextButton: {
    backgroundColor: 'gray', // Apply a different style for disabled button
  },
});