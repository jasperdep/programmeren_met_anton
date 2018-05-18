import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { Spinner, Container, Content, Button, List, ListItem, Text, Thumbnail, Body } from 'native-base';

import {observer} from 'mobx-react';
import applicationState from '../ApplicationState'

@observer
export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'React Native Quickly',
  });

  componentDidMount() {
    // Fetch the list as soon the app opens
    applicationState.getThings()
  }

  render() {
    const { navigate } = this.props.navigation;
    let content = null;
    if (applicationState.loading_routes) {
      content = <Spinner />
    }
    else {
      // MobX' ObservableArray is not handled properly by NativeBase, so convert it to a plain array first
      let items = applicationState.things.map((item) => {return item;})

      content = <List dataArray={items}
        renderRow={(item) =>
        <ListItem onPress={() => navigate('Detail', { thing: item }) }>
          <Thumbnail square size={80} source={{ uri: item.thumbnail }} />
          <Body>
            <Text>{ item.name }</Text>
            <Text note>{ item.description }</Text>
          </Body>
        </ListItem>
        }>
        </List>
    }

    return (
      <Container>
        <Content>
          { content }
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  
});