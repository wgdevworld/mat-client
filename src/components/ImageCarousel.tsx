/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Image, StyleSheet, ActivityIndicator} from 'react-native';
import Swiper from 'react-native-swiper';
import colors from '../styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ImageCarouselProps {
  images?: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({images}) => {
  // State to track loading of each image
  const [loading, setLoading] = useState<boolean[]>(
    new Array(images?.length).fill(true),
  );

  // Function to update loading state for each image
  const handleLoad = (index: number) => {
    const updatedLoading = [...loading];
    updatedLoading[index] = false;
    setLoading(updatedLoading);
  };

  return (
    <View style={styles.container}>
      <Swiper
        showsButtons={images && images.length > 1 ? true : false}
        autoplay
        autoplayTimeout={5}
        loop
        dotColor={colors.grey}
        activeDotColor={colors.coral1}
        nextButton={
          <Ionicons
            name="chevron-forward-outline"
            size={30}
            color={colors.coral1}
          />
        }
        prevButton={
          <Ionicons
            name="chevron-back-outline"
            size={30}
            color={colors.coral1}
          />
        }>
        {images &&
          images.map((imageURI, index) => (
            <View key={imageURI + index} style={styles.slide}>
              {loading[index] && (
                <ActivityIndicator
                  size="large"
                  color={colors.coral1}
                  style={{alignSelf: 'center', marginTop: 100}}
                />
              )}
              <Image
                source={{uri: imageURI}}
                style={styles.image}
                onLoad={() => handleLoad(index)}
                onError={() => handleLoad(index)}
              />
            </View>
          ))}
      </Swiper>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 220,
    marginBottom: 10,
  },
  slide: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    width: '100%',
    flex: 1,
    resizeMode: 'cover',
  },
});

export default ImageCarousel;
