/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import ImageCarousel from '../components/ImageCarousel';
// import assets from '../../assets';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {Review} from '../types/store';
import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import assets from '../../assets';
interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({review}) => {
  const insets = useSafeAreaInsets();
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImageView = (index: number) => {
    setCurrentImageIndex(index);
    setImageViewVisible(true);
  };
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={assets.images.default_profile}
          style={{height: 40, width: 40, borderRadius: 40, marginRight: 4}}
        />
        <View style={{justifyContent: 'space-around'}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: '600', paddingTop: 1}}>
              {review.author.split('$')[0]}
            </Text>
            {review.author.split('$')[1] && (
              <Text>{' | ' + review.author.split('$')[1]}</Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            {Array.from({length: review.rating}, (_, index) => (
              <Ionicons
                key={index}
                name="star"
                size={16}
                color={colors.coral1}
              />
            ))}
            {Array.from({length: 5 - review.rating}, (_, index) => (
              <Ionicons key={index} name="star" size={16} color={colors.grey} />
            ))}
            <Text>{' ' + review.date.toLocaleDateString('ko-KR')}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.contentText}>{review.content}</Text>
      {review.images && review.images.length > 0 && (
        <>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            key={review.date + review.content}>
            {review.images.map((image: any, index: number) => (
              <TouchableOpacity
                key={image.src + image.id}
                onPress={() => openImageView(index)}>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    marginRight: 10,
                    marginVertical: 10,
                  }}
                  source={{uri: image.src}}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Modal
            visible={isImageViewVisible}
            transparent={false}
            onRequestClose={() => setImageViewVisible(false)}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 10,
                top: insets.top,
                zIndex: 1,
              }}
              onPress={() => setImageViewVisible(false)}>
              <Ionicons
                name="close-circle-outline"
                size={30}
                color={colors.coral1}
              />
            </TouchableOpacity>
            <Swiper
              activeDotColor={colors.coral1}
              index={currentImageIndex}
              loop={false}>
              {review.images.map((image: any) => (
                <View key={image.src + image.id} style={styles.fullScreenImage}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    resizeMode="contain"
                    source={{uri: image.src}}
                  />
                </View>
              ))}
            </Swiper>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    marginBottom: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 0.17,
    padding: 12,
  },
  fullScreenImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentText: {
    marginTop: 5,
  },
});

export default ReviewCard;
