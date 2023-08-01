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
    placeholder: ImageSourcePropType;
    default_profile: ImageSourcePropType;
    kakao_login_medium_narrow: ImageSourcePropType;
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
    달버터1: require('./image/7.png'),
    달버터2: require('./image/8.png'),
    달버터3: require('./image/9.png'),
    달버터4: require('./image/10.png'),
    교래퐁낭1: require('./image/11.png'),
    교래퐁낭2: require('./image/12.png'),
    교래퐁낭3: require('./image/13.png'),
    산방산국수맛집1: require('./image/14.png'),
    산방산국수맛집2: require('./image/15.png'),
    애월제주다: require('./image/16.png'),
    default_map: require('./image/map_default.jpeg'),
    placeholder: require('./image/placeholder.png'),
    default_profile: require('./image/default_profile.png'),
    kakao_login_medium_narrow: require('./image/kakao_login_medium_narrow.png'),
  },
};

export default assets;
