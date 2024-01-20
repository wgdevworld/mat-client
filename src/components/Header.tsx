import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  onPressBack: () => void;
  color: string;
  buttonColor: string;
};

const height = Dimensions.get('window').height;

const Header = (props: Props) => {
  const {onPressBack, color, buttonColor} = props;

  return (
    <View style={{...styles.container, backgroundColor: color}}>
      <TouchableOpacity onPress={onPressBack}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={buttonColor}
          style={styles.backButton}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.04,
  },
  backButton: {
    paddingLeft: 16,
  },
});

export default Header;
