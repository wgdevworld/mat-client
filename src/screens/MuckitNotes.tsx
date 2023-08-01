import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, TextInput, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../styles/colors';

export default function MuckitNotes() {
  //백엔드 연결 필요 (현재 내용 출처: https://kokyu.tistory.com/1602)
  const initialList = [
    { id: 1, title: '족발 막국수', description: '실패없는 꿀조합! 막국수에 고기 싸먹기', checked: false },
    { id: 2, title: '엽떡 명랑핫도그', description: '핫도그에 치즈 돌돌 말아서 국물에 적셔먹기', checked: false },
    { id: 3, title: '파파존스 브라우니 투게더', description: '꾸덕꾸덕 브라우니에 투게더 올려먹기', checked: false },
  ];

  const [items, setItems] = useState(initialList);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCheckboxToggle = (itemId) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddItem = () => {
    if (newTitle && newDescription) {
      const newItem = {
        id: Date.now(),
        title: newTitle,
        description: newDescription,
        checked: false,
      };
      setItems((prevItems) => [...prevItems, newItem]);
      setNewTitle('');
      setNewDescription('');
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.itemContainer, item.checked && styles.checkedItem]}
        onPress={() => handleCheckboxToggle(item.id)}
      >
        <View>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
        <View style={styles.checkbox} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>✔️ 나만의 먹킷리스트</Text>
        <View style={{ paddingHorizontal: 24 }}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="새로운 먹킷"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="추가 노트"
              value={newDescription}
              onChangeText={setNewDescription}
            />
            <Button title="먹킷 추가하기" onPress={handleAddItem} color={colors.coral1}/>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 24 },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  checkedItem: {
    backgroundColor: colors.grey,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  itemDescription: {
    fontSize: 14,
    color: 'black',
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.coral1,
  },
  formContainer: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 165,
    marginBottom: 40
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});