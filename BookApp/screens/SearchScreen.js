import React from 'react';
import { View, Text,StyleSheet } from 'react-native';

export default class Search extends React.Component {
  static navigationOptions = {
    title: 'Search',
  };

  render() {
      return (
  	    <View style={styles.container}>
         <Text style={styles.description}>
        	  Search Tab
         </Text>
     </View>
    );
  }
}

var styles = StyleSheet.create({
    description: {
        fontSize: 20,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

//following line is not needed in expo; epo deals with this automatically
//AppRegistry.registerComponent('BookSearch', () => BookSearch);
//The above defines the entry point to the application. This is where the JavaScript code start executing
