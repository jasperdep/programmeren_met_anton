import React, { Component } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import t from 'tcomb-form-native'; // 0.6.11

// Form
const Form = t.form.Form;

// Form model
const User = t.struct({
  email: t.String,
  password: t.String,
});

export default class App extends Component {
  handleSubmit() {
    console.log(this.loginform);
  }
  
  render() {
    return (
      <View style={styles.container}>
      <Text>Login</Text>
        <Form ref={c => this.loginform = c} type={User} />
        <Button
          title="Login"
          onPress={this.handleSubmit}
        />Ï
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
});