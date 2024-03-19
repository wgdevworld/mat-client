/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {useAppSelector} from '../store/hooks';
import {
  FlatList,
  Image,
  Linking,
  Platform,
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const VisitedZips = () => {
  const savedZips = useAppSelector(state => state.visitedZips.visitedZips);
  const viewRef = useRef<View>(null);
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const insets = useSafeAreaInsets();

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
            backgroundImage: uri,
            backgroundBottomColor: '#FF4000',
            backgroundTopColor: '#FF4000',
            social: Social.InstagramStories,
            appId: `${Config.FACEBOOK_APP_ID}`,
          });
        } else {
          await Share.open({url: uri});
        }
        setIsPressedShare(false);
      } catch (e) {
        console.log(e);
        setIsPressedShare(false);
      } finally {
      }
    }, 500);
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
    <View
      style={{
        flex: 1,
        backgroundColor: colors.coral1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
      ref={viewRef}>
      <Header
        onPressBack={() => navigation.goBack()}
        color={colors.coral1}
        buttonColor={isPressedShare ? 'transparent' : colors.white}
      />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}>
          <Text style={styles.pageHeader}>최근에 가본 맛집들</Text>
          {isPressedShare ? (
            <Image
              source={assets.images.app_logo_white}
              style={{
                height: 35,
                width: 35,
                alignSelf: 'center',
              }}
              resizeMethod="scale"
            />
          ) : (
            <TouchableOpacity onPress={onPressShare}>
              {showInstagramStory ? (
                <Ionicons
                  name="logo-instagram"
                  size={30}
                  color={colors.white}
                />
              ) : (
                <Ionicons name="share-outline" size={30} color={colors.white} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={
            isPressedShare
              ? savedZips.length > 4
                ? savedZips.slice(0, 5)
                : savedZips
              : savedZips
          }
          renderItem={({item}) => renderItem(item)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: colors.coral1,
  },
  pageHeader: {
    fontSize: 30,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'left',
    alignSelf: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.coral1,
    borderRadius: 10,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    // borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfoContainer: {
    justifyContent: 'space-around',
    paddingVertical: 10,
    flex: 1,
  },
  itemTitleText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    paddingBottom: 5,
    // width: 150,
  },
  itemStarsText: {
    fontSize: 14,
    color: colors.white,
    paddingRight: 10,
    paddingLeft: 3,
  },
  itemReviewText: {
    fontSize: 14,
    color: colors.white,
  },
  itemSubtext: {
    color: colors.white,
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
