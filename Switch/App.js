import React from 'react';
import { StyleSheet, Text, View, AppRegistry, Switch, Alert } from 'react-native';

let randomHex = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default class App extends React.Component {

constructor(props){
   super(props);

 
   this.state ={
    SwitchOnValueHolder :  false,
    bgColor: 'purple'

   }
 }

 ShowAlert = (value) =>{
  
   this.setState({
  
     SwitchOnValueHolder: value
   })

  ChangeBackground = (value) =>{

    this.setState({
      bgColor: 'orange'
    })

   }

  
   if(value == true)
   {
  
     Alert.alert("De achtergrond is BLAUW");
     //bgColor='blue';
     this.setState({bgColor: 'red'})
    
   }
   else{

     Alert.alert("De achtergrond is GROEN");
     //bgColor='green';
     this.setState({bgColor: 'yellow'});
   }
  
 }

render() {
 
   return (

 
     <View style={[styles.MainContainer,{backgroundColor:this.state.bgColor}]}>
 
       <Text style={{fontSize: 18}}> Switch </Text>
 
        <Switch
          onValueChange={(value) => this.ShowAlert(value)}
          
          style={{marginBottom: 10,}}
          value={this.state.SwitchOnValueHolder} />
 
     </View>
   );
 }
}

let bgColor= 'green';

const styles = StyleSheet.create({
 
MainContainer :{
 
justifyContent: 'center',
alignItems: 'center',
flex:1,
margin: 10,
backgroundColor: bgColor

 
}
 
});

AppRegistry.registerComponent('randomBackground', () => randomBackground);
