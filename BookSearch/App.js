import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

import Search from './screens/Search' 
import Featured from './screens/Featured'
import BookDetail from './screens/BookDetail'


const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const FirstRoute = () => <View style={[ styles.container, { backgroundColor: '#eef287' } ]} ><Search/></View>;
const SecondRoute = () => <View style={[ styles.container, { backgroundColor: '#673ab7' } ]} ><Featured/></View>;
const ThirdRoute = () => <View style={[ styles.container, { backgroundColor: '#673ab7' } ]} ><BookDetail/></View>;


export default class TabViewExample extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Search' },
      { key: 'second', title: 'Featured' },
      { key: 'third', title: 'BookDetail '}
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} />;

  _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  render() {
    return (
      <TabViewAnimated
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});