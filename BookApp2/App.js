import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
//generated screen using exp init BookApp, and selecting tab instead of blank
//Had to update expo AND expo-app, otherwise they would not support version expo 27.0.0
//afterwards modified App.js (overwritten it with example TabBar-example
//then added original screens to mollify it somewhat
//rmoved fontFamily:  in StyledText.js

import Featured from './screens/Featured';
import Search from './screens/Search';
import {
  StackNavigator,
} from 'react-navigation';
import BookDetail from './screens/BookDetail';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};
let myTabView=null;
//beautify first and second screen; add HomeScreen and other one


const FirstRoute = () => <View style={[ styles.container, { backgroundColor: '#F73ab7' } ]} ><Featured showBookDetail={myTabView.showBookDetail.bind(myTabView)}/></View>;
const SecondRoute = () => <View style={[ styles.container, { backgroundColor: '#F73ab7' } ]} ><Search/></View>;

class TabViewExample extends React.Component {
    //hide header for navigation on this (main) screen
    static navigationOptions = {
        header: null
    };
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Featured' },
      { key: 'second', title: 'Search' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} />;

  _renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
   
  });
  constructor(props) {
       super(props);
       myTabView=this;
   }

  
  showBookDetail(book) {
      //console.log("show:",book);
      this.props.navigation.navigate('BookDetail', { book: book })
    //look at:https://facebook.github.io/react-native/docs/navigation.html
       /*this.props.navigator.push({
           title: book.volumeInfo.title,
           component: BookDetail,
           passProps: {book}
       });*/
   }

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


const App = StackNavigator(
  {
    Home: { screen: TabViewExample },
    BookDetail: { screen: BookDetail },
  },
  {
    initialRouteName: 'Home',
  }
);

export default App;
