/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import MapCard from '../components/MapCard';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../store/hooks';
import {MatMap} from '../types/store';

export default function ListMaps() {
  const dispatch = useDispatch();
  const publicMaps = useAppSelector(state => state.publicMaps.maps);

  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const [maps, setMaps] = useState<MatMap[]>(publicMaps);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={styles.containter}>
        <Text style={styles.heading}>지도 탐색 🚀 </Text>
        <View style={{paddingHorizontal: 24}}>
          <FlatList
            data={maps}
            keyExtractor={item => item.name}
            scrollEnabled={false}
            renderItem={({item}) => (
              <MapCard
                id={item.id}
                mapName={item.name}
                followers={1}
                author={item.author}
                imgSrc={item.imageSrc}
                onPressMap={() => navigation.navigate('ZipList', {map: item})}
              />
            )}
          />
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
});
