/* eslint-disable react-native/no-inline-styles */
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import React from 'react';
import {StyleSheet, Text, Animated, View} from 'react-native';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

type SwipeableRowProps = {
  children: React.ReactNode;
  onSwipeableRightOpen: () => void;
};

const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  onSwipeableRightOpen,
}) => {
  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.rightAction}
        onPress={onSwipeableRightOpen}>
        <Ionicons name="trash" size={24} color="white" />
      </TouchableOpacity>
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
    height: '90%',
    alignSelf: 'center',
    marginRight: 16,
    borderRadius: 10,
  },
  actionText: {
    // Define your styles for the text inside the delete button
  },
});

export default SwipeableRow;
