import React from 'react';
import {StyleSheet} from 'react-native';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

type SwipeableRowProps = {
  children: React.ReactNode;
  onSwipeableRightOpen: () => void;
  borderRadius?: number;
};

const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  onSwipeableRightOpen,
  borderRadius,
}) => {
  const renderRightActions = () => {
    return (
      <RectButton
        style={{...styles.rightAction, borderRadius: borderRadius}}
        onPress={onSwipeableRightOpen}>
        <Ionicons name="trash" size={24} color="white" />
      </RectButton>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}>
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: 50,
    height: '100%',
    alignSelf: 'center',
  },
});

export default SwipeableRow;
