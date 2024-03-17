/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {useAppSelector} from '../store/hooks';
import {
  FlatList,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import assets from '../../assets';
import colors from '../styles/colors';
import {trimCountry} from '../tools/CommonFunc';
import {MatZip} from '../types/store';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ScreenParamList} from '../types/navigation';
import {captureRef} from 'react-native-view-shot';
import Header from '../components/Header';
import Share, {Social} from 'react-native-share';
import Config from 'react-native-config';

const VisitedZips = () => {
  const savedZips = useAppSelector(state => state.visitedZips.visitedZips);
  const viewRef = useRef<View>(null);
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();

  const [showInstagramStory, setShowInstagramStory] = useState(false);
  const [isPressedShare, setIsPressedShare] = useState(false);
  const apiKey = Config.MAPS_API;
  useEffect(() => {
    if (Platform.OS === 'ios') {
      Linking.canOpenURL('instagram://')
        .then(val => setShowInstagramStory(val))
        .catch(err => console.log(err));
    } else {
      Share.isPackageInstalled('com.instagram.android').then(({isInstalled}) =>
        setShowInstagramStory(isInstalled),
      );
    }
  });
  const onPressShare = async () => {
    setIsPressedShare(true);
    setTimeout(async () => {
      try {
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 0.7,
        });
        if (showInstagramStory) {
          await Share.shareSingle({
            stickerImage: uri,
            social: Social.InstagramStories,
            appId: `${Config.FACEBOOK_APP_ID}`,
          });
        } else {
          await Share.open({url: uri});
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsPressedShare(false);
      }
    }, 100);
  };
  const renderItem = (matZip: MatZip) => (
    <>
      <View>
        <TouchableOpacity
          activeOpacity={1}
          key={matZip.id}
          style={styles.itemContainer}
          onPress={() => {
            navigation.navigate('MatZipMain', {zipID: matZip.id});
          }}>
          <View style={styles.itemImageContainer}>
            <Image
              source={
                matZip.imageSrc && matZip.imageSrc.length === 0
                  ? {
                      uri: `https://maps.googleapis.com/maps/api/streetview?size=1200x1200&location=${matZip.coordinate.latitude},${matZip.coordinate.longitude}&key=${apiKey}`,
                    }
                  : {uri: matZip.imageSrc[0]}
              }
              style={styles.itemImage}
            />
          </View>
          <View style={styles.itemInfoContainer}>
            <View style={styles.itemTitleStarsContainer}>
              <Text
                style={styles.itemTitleText}
                numberOfLines={1}
                ellipsizeMode="tail">
                {matZip.name}
              </Text>
              <View style={styles.itemStarReviewContainer}>
                <Ionicons name="star" size={14} color={colors.coral1} />
                <Text style={styles.itemStarsText}>
                  {matZip.reviewAvgRating}
                </Text>
                <Text style={styles.itemReviewText}>
                  리뷰 {matZip.reviewCount}개
                </Text>
              </View>
            </View>
            <Text
              style={styles.itemSubtext}
              numberOfLines={1}
              ellipsizeMode="tail">
              {trimCountry(matZip.address)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{height: 8}} />
    </>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Header
        onPressBack={() => navigation.goBack()}
        color={colors.white}
        buttonColor={colors.coral1}
      />
      <View style={styles.container} ref={viewRef}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.pageHeader}>내가 가본 맛집들</Text>
          {isPressedShare ? (
            <Image
              source={assets.images.app_logo}
              style={{
                height: '100%',
                width: '10%',
                alignSelf: 'center',
                marginBottom: 12,
              }}
              resizeMethod="scale"
            />
          ) : (
            <TouchableOpacity onPress={onPressShare}>
              {showInstagramStory ? (
                <Ionicons
                  name="logo-instagram"
                  size={30}
                  color={colors.coral1}
                />
              ) : (
                <Ionicons
                  name="share-outline"
                  size={30}
                  color={colors.coral1}
                />
              )}
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={savedZips}
          renderItem={({item}) => renderItem(item)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  pageHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.coral1,
    marginBottom: 12,
    textAlign: 'left',
    alignSelf: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.grey,
    borderRadius: 10,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfoContainer: {
    justifyContent: 'space-between',
    flex: 1,
  },
  itemTitleText: {
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
    paddingBottom: 5,
    width: 150,
  },
  itemStarsText: {
    fontSize: 14,
    color: colors.coral1,
    paddingRight: 10,
    paddingLeft: 3,
  },
  itemReviewText: {
    fontSize: 14,
    color: colors.coral1,
  },
  itemSubtext: {
    color: 'black',
    paddingVertical: 2,
    fontWeight: '300',
  },
  itemTitleStarsContainer: {
    flexDirection: 'row',
    // paddingVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemStarReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default VisitedZips;
