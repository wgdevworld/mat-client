/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../styles/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapMain from './MapMain';
import ListMaps from './ListMaps';
import SettingsMain from './SettingsMain';
import MuckitNotes from './MuckitNotes';
import CreateMatZip from './CreateMatZip';
import AppleLoginPage from './AppleLoginTest';

const screenWidth = Dimensions.get('window').width;

const Tab = createBottomTabNavigator();

const TabNavContainer = () => {
  const MyTabBar = ({state, navigation: TabNavigation}: BottomTabBarProps) => {
    return (
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = TabNavigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              TabNavigation.navigate('TabNavContainer', {
                screen: route.name,
              });
            }
          };
          let icon = null;
          switch (route.name) {
            case 'Map':
              icon = (
                <Ionicons
                  name="map-outline"
                  size={screenWidth * 0.08}
                  color='black'
                />
              );
              break;
            case 'List':
              icon = (
                <Ionicons
                  name="star-outline"
                  size={screenWidth * 0.08}
                  color='grey'
                />
              );
              break;
            case 'Community':
              icon = (
                <Ionicons
                  name="people-outline"
                  size={screenWidth * 0.08}
                  color='grey'
                />
              );
              break;
            case 'Settings':
              icon = (
                <Ionicons
                  name="person-circle-outline"
                  size={screenWidth * 0.08}
                  color='grey'
                />
              );
              break;
            default:
              icon = null;
              break;
          }

          return (
            <TouchableOpacity
              key={index}
              style={styles.iconContainer}
              onPress={onPress}>
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      initialRouteName={'Map'}
      screenOptions={() => {
        return {
          lazy: false,
          headerShown: false,
        };
      }}>
      <Tab.Screen name="Map" component={CreateMatZip} />
      <Tab.Screen name="List" component={ListMaps} />
      <Tab.Screen name="Community" component={MuckitNotes} />
      <Tab.Screen name="Settings" component={SettingsMain} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    width: '100%',
    backgroundColor: colors.white,
  },
  iconContainer: {
    flex: 1,
    width: 94,
    height: 58,
    paddingBottom: 22,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default TabNavContainer;
