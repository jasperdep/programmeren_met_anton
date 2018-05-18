import React from 'react';
import {
  AppRegistry
} from 'react-native';

import {
  createStackNavigator,
} from 'react-navigation';

import HomeScreen from './components/HomeScreen';
import DetailScreen from './components/DetailScreen';

export default createStackNavigator({
  Home: { screen: HomeScreen },
  Detail: { screen: DetailScreen },
});

