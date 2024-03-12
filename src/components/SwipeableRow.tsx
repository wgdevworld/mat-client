import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors';

type SwipeableRowProps = {
  children: React.ReactNode;
  onSwipeableRightOpen: () => void;
  borderRadius?: number;
  renderRight?: boolean;
  onSwipeableLeftOpen: () => void;
  renderLeft?: boolean;
};

const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  onSwipeableRightOpen,
  borderRadius,
  renderRight = true,
  onSwipeableLeftOpen,
  renderLeft = true,
}) => {
  const swipeableRef = useRef<Swipeable>(null);
  const renderRightActions = () => {
    return (
      <RectButton
        style={{...styles.rightAction, borderRadius: borderRadius}}
        onPress={onSwipeableRightOpen}>
        <Ionicons name="trash" size={24} color="white" />
      </RectButton>
    );
  };
  const renderLeftActions = () => {
    return (
      <RectButton
        style={{
          ...styles.rightAction,
          backgroundColor: colors.coral1,
          borderRadius: borderRadius,
        }}
        onPress={() => {
          onSwipeableLeftOpen();
          swipeableRef.current?.close();
        }}>
        <Ionicons name="checkmark-circle-outline" size={24} color="white" />
      </RectButton>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRight ? renderRightActions : undefined}
      renderLeftActions={renderLeft ? renderLeftActions : undefined}
      overshootRight={false}
      overshootLeft={false}
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
