import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import colors from '../styles/colors';


export default function CreateMatZip() {

    const [id, setId] = useState('');
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [imgSrc, setImgSrc] = useState('');
    const [category, setCategory] = useState('');

    const handleCreateZip = async () => {
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>🏠 새로운 맛집 등록하기</Text>
            <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="장소명"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="주소"
            value={address}
            onChangeText={setAddress}
          />
          {/* TODO: 이미지 업로드 버튼으로 대체하기 */}
          <TextInput
            style={styles.input}
            placeholder="이미지 링크"
            value={imgSrc}
            onChangeText={setImgSrc}
          />
          <TextInput
            style={styles.input}
            placeholder="카테고리"
            value={category}
            onChangeText={setCategory}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleCreateZip}>
            <Text style={styles.addButtonText}>맛집 등록하기</Text>
          </TouchableOpacity>
        </View>
          </ScrollView>
        </SafeAreaView>
      );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 15
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: colors.coral1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 20
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});