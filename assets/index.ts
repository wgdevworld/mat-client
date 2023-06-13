import {ImageSourcePropType} from 'react-native';

export type AssetImages = {
  images: {
    [key: string]: ImageSourcePropType;
    스시올로지: ImageSourcePropType;
    진만두: ImageSourcePropType;
    월량관: ImageSourcePropType;
    이안정: ImageSourcePropType;
    카와카츠: ImageSourcePropType;
    야키토리나루토: ImageSourcePropType;
  };
};

const assets: AssetImages = {
  images: {
    스시올로지: require('./image/1.png'),
    진만두: require('./image/2.png'),
    월량관: require('./image/3.png'),
    이안정: require('./image/4.png'),
    카와카츠: require('./image/5.png'),
    야키토리나루토: require('./image/6.png'),
  },
};

export default assets;
