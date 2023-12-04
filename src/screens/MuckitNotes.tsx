import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  SafeAreaView,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import colors from '../styles/colors';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../store/hooks';
import {MuckitItem} from '../types/store';
import {REQ_METHOD, request} from '../controls/RequestControl';
import {
  addMuckitemAction,
  deleteMuckitemAction,
  updateMuckitemAction,
} from '../store/modules/userItems';
import SwipeableRow from '../components/SwipeableRow';
import {updateIsLoadingAction} from '../store/modules/globalComponent';

export default function MuckitNotes() {
  const dispatch = useDispatch();
  const userOwnItems = useAppSelector(
    state => state.userMuckitems.ownMuckitems,
  );

  const [items, setItems] = useState<MuckitItem[]>(userOwnItems);
  useEffect(() => {
    setItems(userOwnItems);
  }, [userOwnItems]);
  const [newItemText, setNewItemText] = useState('');

  const handleCheckboxToggle = async (itemId: any) => {
    try {
      dispatch(updateIsLoadingAction(true));
      const variables = {
        itemId: itemId,
      };
      const toggleStatusMutation = `
    mutation toggleMuckitemStatus($itemId: String!) {
      toggleMuckitemStatus(itemId: $itemId) {
        id
        title
        description
        completeStatus
      }
    }
    `;
      const toggleStatusRes = await request(
        toggleStatusMutation,
        REQ_METHOD.MUTATION,
        variables,
      );
      const updatedItemData = toggleStatusRes?.data?.data?.toggleMuckitemStatus;
      const updatedItem: MuckitItem = {
        id: updatedItemData.id,
        title: updatedItemData.title,
        description: updatedItemData.description,
        completeStatus: updatedItemData.completeStatus,
      };
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? {...item, checked: updatedItemData.completeStatus}
            : item,
        ),
      );
      dispatch(updateMuckitemAction(updatedItem));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(updateIsLoadingAction(false));
    }
  };

  const onDeleteMuckitem = async (itemId: string) => {
    try {
      dispatch(updateIsLoadingAction(true));
      const variables = {
        itemId: itemId,
      };
      const deleteItemMutation = `
        mutation deleteMuckitem($itemId: String!) {
          deleteMuckitem(itemId: $itemId)
        }
      `;
      await request(deleteItemMutation, REQ_METHOD.MUTATION, variables);
      dispatch(deleteMuckitemAction(itemId));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(updateIsLoadingAction(false));
    }
  };

  const handleAddItem = async () => {
    if (newItemText.trim() !== '') {
      const variables = {
        createItemInput: {
          title: newItemText.trim(),
          description: '',
        },
      };
      const addItemMutation = `
      mutation createMuckitem($createItemInput: CreateItemInput!) {
        createMuckitem(createItemInput: $createItemInput) {
          id
          title
          description
          completeStatus
        }
      }`;
      const addItemRes = await request(
        addItemMutation,
        REQ_METHOD.MUTATION,
        variables,
      );
      const newItemData = addItemRes?.data?.data?.createMuckitem;
      console.log(newItemData);
      const newItem: MuckitItem = {
        id: newItemData.id,
        title: newItemData.title,
        description: newItemData.description,
        completeStatus: newItemData.completeStatus,
      };
      dispatch(addMuckitemAction(newItem));
      setItems(prevItems => [...prevItems, newItem]);
      setNewItemText('');
      Keyboard.dismiss(); // Close the keyboard after adding
    }
  };

  const renderItem = ({item}) => {
    return (
      <SwipeableRow
        onSwipeableRightOpen={() => {
          onDeleteMuckitem(item.id);
        }}>
        <TouchableOpacity
          style={[
            styles.itemContainer,
            item.completeStatus && styles.checkedItem,
          ]}
          onPress={() => handleCheckboxToggle(item.id)}>
          <View>
            <Text style={styles.itemTitle}>{item.title}</Text>
          </View>
          <View style={styles.checkbox} />
        </TouchableOpacity>
      </SwipeableRow>
    );
  };

  const handleTextInputChange = text => {
    setNewItemText(text);
  };

  const handleTextInputSubmit = async () => {
    dispatch(updateIsLoadingAction(true));
    await handleAddItem();
    dispatch(updateIsLoadingAction(false));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>나만의 먹킷리스트 ✔️</Text>
          </View>
          <View style={{paddingHorizontal: 24}}>
            <FlatList
              data={items}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
            />
            <TextInput
              style={styles.input}
              placeholder="새로운 먹킷"
              value={newItemText}
              onChangeText={handleTextInputChange}
              onSubmitEditing={handleTextInputSubmit}
              returnKeyType="done"
              blurOnSubmit={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {paddingVertical: 24},
  headingContainer: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    paddingHorizontal: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  checkedItem: {
    backgroundColor: colors.grey,
  },
  itemTitle: {
    fontSize: 16,
    color: 'black',
  },
  checkbox: {
    width: 15,
    height: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.coral1,
  },
  input: {
    height: 35,
    borderColor: '#ccc',
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 8,
  },
});
