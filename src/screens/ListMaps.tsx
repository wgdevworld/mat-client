/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import MapCard from '../components/MapCard';

export default function ListMaps() {
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  //   const images = [assets.images.스시올로지, assets.images.야키토리나루토];
  const handlePressMap = () => {
    // Implement the functionality to add a follower here
    console.log('Map pressed');
  };
  const mapData = [
    {
      mapName: '라멘여지도',
      followers: 342,
      author: '홍길동',
      onPressMap: handlePressMap,
    },
    {
      mapName: '또간집',
      followers: 10230,
      author: '윤지원',
      onPressMap: handlePressMap,
    },
    {
      mapName: '비밀이야',
      followers: 210000,
      author: '운영진',
      onPressMap: handlePressMap,
    },
    // Add more store data as needed
  ];

  //   <SafeAreaView style={styles.container}>
  //       <FlatList
  //         data={storeData}
  //         keyExtractor={(item) => item.id}
  //         renderItem={({ item }) => (
  //           <StoreCard storeName={item.name} onPress={() => handleStorePress(item.id)} />
  //         )}
  //       />
  //     </SafeAreaView>

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={styles.containter}>
        <Text style={styles.heading}>지도 모음집</Text>
        <View style={{paddingHorizontal: 24}}>
          <FlatList
            data={mapData}
            keyExtractor={item => item.mapName}
            renderItem={({item}) => (
              <MapCard
                mapName={item.mapName}
                followers={item.followers}
                author={item.author}
                onPressMap={item.onPressMap}
              />
            )}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>프로필 설정</Text>
          {/* <TouchableOpacity style={styles.row} onPress={toggleEdit}>
            <Text style={styles.rowText}>닉네임</Text>
            <View style={{flex: 1}} />
            <TextInput
              keyboardType="default"
              style={styles.input}
              placeholder="현재 닉네임"
              placeholderTextColor="grey"
              selectionColor="black"
              editable={isEdit}
              onEndEditing={() => {
                setIsEdit(false);
                // TODO: change nickname text onEndEditing
              }}
              onChangeText={text => setNickname(text)}
            />
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.row} onPress={toggleEditAddr}>
            <Text style={styles.rowText}>주소</Text>
            <View style={{flex: 1}} />
            <TextInput
              keyboardType="default"
              style={styles.input}
              placeholder="서울시 중구 길동로 32"
              placeholderTextColor="grey"
              selectionColor="black"
              editable={isEditAddr}
              onEndEditing={() => {
                setIsEditAddr(false);
                // TODO: change nickname text onEndEditing
              }}
              onChangeText={text => setAddr(text)}
            />
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowText}>비밀번호 변경</Text>
            <View style={{flex: 1}} />
            <Ionicons
              name="chevron-forward-outline"
              color="#0c0c0c"
              size={22}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.delete}
            onPress={() => {
              // to backend, to login screen
            }}>
            <Text style={styles.deleteText}>탈퇴하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SettingsMain');
            }}>
            <View style={styles.row}>
              <Text style={styles.rowText}>계정 관리</Text>
              <View style={{flex: 1}} />
              <Ionicons
                name="chevron-forward-outline"
                color="#0c0c0c"
                size={22}
              />
            </View>
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
    marginBottom: 20,
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  map: {
    height: 100,
    backgroundColor: '#FF4000',
    borderRadius: 20,
    marginBottom: 12,
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
  mapName: {
    fontSize: 19,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  mapText: {
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
  rowResultText: {
    fontSize: 16,
    color: '#989898',
  },
  input: {
    color: '#989898',
    // borderBottomColor: '#eee',
    fontSize: 16,
    textAlign: 'right',
  },
  delete: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: 'grey',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  deleteText: {
    fontSize: 17,
    color: 'red',
    fontWeight: 'bold',
  },
});
