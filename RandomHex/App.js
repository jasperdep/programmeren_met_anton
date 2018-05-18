import React from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';

var  colors = ['#ddd', '#efefef', 'red', '#666', 'rgba(0,0,0,.1)', '#ededed'];
var backgroundcolors = ['green', 'black', 'orange', 'blue', 'purple', 'pink'];

export default class App extends React.Component {

    constructor()
    {
        super();
 
        this.Animation = new Animated.Value(0);
    }
    componentDidMount()
    {
        // If you want to Start the animation on button click then call this function on button onPress event.
        this.StartBackgroundColorAnimation();
    }

    StartBackgroundColorAnimation = () =>
    {
        this.Animation.setValue(0);
 
        Animated.timing(
            this.Animation,
            {
                toValue: 1,
                duration: 15000
            }
        ).start(() => { this.StartBackgroundColorAnimation() });
    }

  render() {
    return (
      <TouchableHighlight onPress={
        ()=> {
            Alert.alert(
            `You clicked this button`,
            'Hello World！',
            [
            {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => console.log('OK Pressed')},
                 ]
             )
        }
    } style={[styles.button, this.state.pressed ? {backgroundColor: 'green'} : {}]}
    onHideUnderlay={()=>{this.setState({pressed: false})}}
    onShowUnderlay={()=>{this.setState({pressed: true})}}>
        <Text>Button</Text>
    </TouchableHighlight>
    );
}
}

const styles = StyleSheet.create({
  button: {
      padding: 10,
      borderColor: 'blue',
      borderWidth: 1,
      borderRadius: 5
  },
});