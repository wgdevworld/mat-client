import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ImageCarouselProps {
  images: ImageSourcePropType[]; // Use ImageSourcePropType type to represent image references.
  height: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({images, height}) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(contentOffsetX / Dimensions.get('window').width);
    setCurrentPage(page);
  };

  return (
    <View style={[styles.container, {height}]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {images.map((image, index) => (
          <View
            key={index}
            style={[
              styles.imageContainer,
              {width: Dimensions.get('window').width},
            ]}>
            <Image source={image} style={styles.image} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <Ionicons
            key={index}
            name={index === currentPage ? 'circle' : 'circle-thin'}
            size={8}
            color={index === currentPage ? 'gray' : 'lightgray'}
            style={styles.paginationIcon}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  imageContainer: {
    height: '100%',
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    width: '100%',
  },
  paginationIcon: {
    margin: 5,
  },
});

export default ImageCarousel;
