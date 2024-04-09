/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {
  ActivityIndicator,
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
import {REQ_METHOD, request} from '../controls/RequestControl';
import {updateProfileAction} from '../store/modules/user';

const VisitedZips = () => {
  const savedZips = useAppSelector(state => state.visitedZips.visitedZips);
  const userUsernameFromRedux = useAppSelector(state => state.user.username);
  const userProfileFromRedux = useAppSelector(state => state.user.profile);
  const viewRef = useRef<View>(null);
  const navigation = useNavigation<StackNavigationProp<ScreenParamList>>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const [showInstagramStory, setShowInstagramStory] = useState(false);
  const [isPressedShare, setIsPressedShare] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowExplanation, setIsShowExplanation] = useState(false);
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
  const generateProfile = async () => {
    setIsLoading(true);
    const input = savedZips
      .filter(zip => zip.place_id && zip.place_id.length > 0)
      .slice(0, 5)
      .map(zip => zip.place_id);
    if (input.length === 0) {
      try {
        const updateUserVariables = {
          updateUserInput: {
            username: `${userUsernameFromRedux}$${'열정적인 입맛 새내기'}`,
          },
        };
        const updateUserQuery = `
            mutation updateUser($updateUserInput: UpdateUserInput!) {
                updateUser(userInput: $updateUserInput) {
                  username
            }
        }`;
        await request(
          updateUserQuery,
          REQ_METHOD.MUTATION,
          updateUserVariables,
        );
        dispatch(updateProfileAction('열정적인 입맛 새내기'));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await fetch(
          'https://storied-scarab-391406.du.r.appspot.com/generate-profile',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({input: input}),
          },
        );
        const data = await response.json();
        const summary = data.summary;
        const updateUserVariables = {
          updateUserInput: {
            username: `${userUsernameFromRedux}$${summary}`,
          },
        };
        const updateUserQuery = `
          mutation updateUser($updateUserInput: UpdateUserInput!) {
              updateUser(userInput: $updateUserInput) {
                username
          }
      }`;
        await request(
          updateUserQuery,
          REQ_METHOD.MUTATION,
          updateUserVariables,
        );
        dispatch(updateProfileAction(summary));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const renderItem = (matZip: MatZip) => (
    <>
      <View style={{transform: [{scaleX: 0.9}, {scaleY: 0.9}]}}>
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
      <View style={{...styles.container, marginBottom: 50}}>
        <View
          style={{
            padding: 12,
            marginBottom: 16,
          }}>
          {
            <View
              style={{
                alignSelf: 'flex-end',
                paddingBottom: isPressedShare ? 40 : 60,
              }}>
              {isPressedShare ? (
                <Image
                  source={assets.images.app_logo}
                  style={{
                    height: 50,
                    width: 50,
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
          }
          <Text style={styles.pageHeader}>
            {isPressedShare ? '최근에 가본 맛집들' : '가본 맛집들'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // paddingTop: 6,
              zIndex: 1000,
            }}>
            <Text
              style={{
                color: colors.coral1,
                fontSize: 30,
                paddingLeft: 10,
                fontWeight: '700',
                alignSelf: 'center',
              }}>
              {userProfileFromRedux
                ? userProfileFromRedux
                : '열정적인 입맛 새내기'}
            </Text>
            {isPressedShare ? null : isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : savedZips.length >= 5 ? (
              <TouchableOpacity onPress={generateProfile}>
                <Ionicons
                  name="reload-circle-outline"
                  size={24}
                  style={{alignSelf: 'center', paddingTop: 6}}
                  color={colors.coral1}
                />
              </TouchableOpacity>
            ) : (
              <View>
                <View
                  style={{
                    display: isShowExplanation ? 'flex' : 'none',
                    width: 260,
                    position: 'absolute',
                    top: -30,
                    right: 30,
                    backgroundColor: colors.grey,
                    padding: 8,
                    borderRadius: 6,
                  }}>
                  <Text style={{color: colors.coral1, fontSize: 14}}>
                    가장 최근에 가본 맛집을 바탕으로 AI가{' '}
                    {userUsernameFromRedux}
                    님의 한줄평을 만들어줘요! 최소한 5개 이상의 맛집 정보가
                    필요하니, 5개 이상의 맛집을 가봄 표시 후 다시 와주세요!
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsShowExplanation(!isShowExplanation)}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    style={{alignSelf: 'center'}}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View style={{backgroundColor: colors.coral1}}>
          <FlatList
            style={{paddingHorizontal: 12, paddingTop: 24}}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  pageHeader: {
    marginLeft: 12,
    paddingBottom: 12,
    fontSize: 16,
    fontWeight: '400',
    color: colors.coral1,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    // paddingHorizontal: 6,
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
