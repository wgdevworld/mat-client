import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import colors from '../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../../types/navigation';

export default function SignupAddress() {  
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const [address, setAddress] = useState('');
    const handleNext = () => {
      onNext(address);
    };

    function onNext(address: string) {
      navigation.navigate('Survey1');
    };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.coral1,}}>
    <View style={styles.header}>
        <Text style={styles.headerText}>회원가입</Text>
    </View>
    <View style={styles.divider} />
    <Text style={styles.title}>나의 주소를 입력해주세요.</Text>
    <View style={styles.container}>
      <TextInput
        style={[styles.input, styles.placeholderBackground]}
        onChangeText={setAddress}
        value={address}
        placeholder="주소 입력"
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>가입 완료</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.coral1,
    paddingVertical: 30,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  divider: {
    height: 5,
    backgroundColor: 'white',
    marginTop: 10,
    marginHorizontal: 35,
    
  },
  container: {
    flex: 1,
    marginTop: 20, 
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginLeft: 35,
    marginTop: 40,
    marginBottom: 20,
    color: 'white',
  },
  placeholderBackground: {
    backgroundColor: 'white', // Set background color for placeholder
  },
  input: {
    width: 320,
    height: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: colors.grey2,
    width: 320,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});


