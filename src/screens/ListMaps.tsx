/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import MapCard from '../components/MapCard';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '../store/hooks';
import {MatMap} from '../types/store';
import {matMapSerializer} from '../serializer/MatMapSrlzr';
import {replacePublicMapsAction} from '../store/modules/publicMaps';
import {REQ_METHOD, request} from '../controls/RequestControl';
import colors from '../styles/colors';

export default function ListMaps() {
  const dispatch = useDispatch();
  const publicMaps = useAppSelector(state => state.publicMaps.maps);

  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const [orderedMaps, setOrderedMaps] = useState<MatMap[]>(publicMaps);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const orderMaps = () => {
    const newOrdered = [...publicMaps];
    const sorted = newOrdered.sort((a, b) => {
      return b.numFollower! - a.numFollower!;
    });
    return sorted;
  };

  useEffect(() => {
    setOrderedMaps(orderMaps());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicMaps]);

  const onRefreshPublicMaps = async () => {
    setIsRefreshing(true);
    try {
      const fetchAllMapsQuery = `{
        fetchAllMaps {
          id
          name
          description
          createdAt
          publicStatus
          followerList {
            id
          }
          creator {
            id
            name
          }
          images {
            src
          }
          zipList {
            id
            name
            address
            images {
              src
            }
            reviewCount
            reviewAvgRating
            parentMap {
              id
            }
            category
            latitude
            longitude
          }
        }
      }`;
      const publicMapsRes = await request(fetchAllMapsQuery, REQ_METHOD.QUERY);
      const publicMapsData = publicMapsRes?.data?.data?.fetchAllMaps;
      if (publicMapsData) {
        const serializedPublicMaps: MatMap[] = await matMapSerializer(
          publicMapsData,
        );
        dispatch(replacePublicMapsAction(serializedPublicMaps));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.containter}>
        <View style={{paddingHorizontal: 24}}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefreshPublicMaps}
                tintColor={colors.coral1}
              />
            }
            showsVerticalScrollIndicator={false}
            data={orderedMaps}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <MapCard
                map={item}
                onPressMap={() => {
                  navigation.navigate('ZipList', {map: item});
                }}
              />
            )}
            ListHeaderComponent={
              <Text style={styles.heading}>지도 탐색 🚀 </Text>
            }
            ListHeaderComponentStyle={{backgroundColor: 'white'}}
            ListFooterComponent={<View style={{height: 100}} />}
            stickyHeaderIndices={[0]}
          />
        </View>
      </View>
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
