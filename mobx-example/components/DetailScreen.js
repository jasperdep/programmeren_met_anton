import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Image } from 'react-native';
import { Container, Content, Button, Text, Icon, Card, CardItem, Left, Body } from 'native-base';

import {observer} from 'mobx-react';
import applicationState from '../ApplicationState'
import { NavigationActions } from 'react-navigation'

@observer
export default class DetailScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.thing.name,
  });

  render() {
    const { dispatch } = this.props.navigation;
    const { params } = this.props.navigation.state;

    return (
      <Container>
        <Content>
          
          <Card>
            <CardItem>
              <Left>
                <Body>
                  <Text note>{params.thing.description}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Image source={{ uri: params.thing.thumbnail }} style={{height: 200, width: null, flex: 1}}/>
            </CardItem>
          </Card>

        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  
});