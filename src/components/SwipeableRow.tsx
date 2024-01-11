import React from 'react';
import {StyleSheet} from 'react-native';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

type SwipeableRowProps = {
  children: React.ReactNode;
  onSwipeableRightOpen: () => void;
  borderRadius?: number;
  renderRight?: boolean;
};

const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  onSwipeableRightOpen,
  borderRadius,
  renderRight = true,
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
      renderRightActions={renderRight ? renderRightActions : undefined}
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
    height: '99.5%',
    alignSelf: 'center',
  },
});

export default SwipeableRow;
