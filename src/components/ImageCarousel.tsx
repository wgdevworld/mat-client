import React, {useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageSourcePropType,
  StyleProp,
} from 'react-native';
import Swiper from 'react-native-swiper';
interface ImageCarouselProps {
  images: string[];
}

// , style
const ImageCarousel: React.FC<ImageCarouselProps> = ({images}) => {
  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        autoplay
        autoplayTimeout={3}
        loop>
        {images.map((imageSource, index) => (
          <View key={index} style={styles.slide}>
            <Image source={{ uri: imageSource }} style={{...styles, ...styles.image}} />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginBottom: 10
  },
  wrapper: {
    // TODO: add style
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
