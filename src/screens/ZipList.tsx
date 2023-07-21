// 맛집 지도 내의 맛집 리스트

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScreenParamList} from '../types/navigation';

export default function ZipList() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const handlePressMap = () => {
    navigation.navigate('MatZip');
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <TouchableOpacity onPress={handlePressMap}>
            <Text>Testing here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
