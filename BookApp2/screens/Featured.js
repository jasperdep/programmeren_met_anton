import React from 'react';
import { View, TouchableHighlight,Image,ListView, Text,StyleSheet } from 'react-native';

let FAKE_BOOK_DATA = [
    {volumeInfo: {title: 'The Catcher in the Rye', authors: "J. D. Salinger", imageLinks: {thumbnail: 'http://books.google.com/books/content?id=PCDengEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'}}}
];
let REQUEST_URL = 'https://www.googleapis.com/books/v1/volumes?q=subject:fiction';
export default class Featured extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };
  
constructor(props) {
       super(props);
       this.state = {
           isLoading: true,
           dataSource: new ListView.DataSource({
               rowHasChanged: (row1, row2) => row1 !== row2
           })
       };
   }

componentDidMount() {
       this.fetchData();
   }
 
   fetchData() {
       fetch(REQUEST_URL)
       .then((response) => response.json())
       .then((responseData) => {
           this.setState({
               dataSource: this.state.dataSource.cloneWithRows(responseData.items),
               isLoading: false
           });
       })
       .done();
   }
showBookDetail(book) {
    //look at:https://facebook.github.io/react-native/docs/navigation.html
    this.props.showBookDetail(book);
       /*this.props.navigator.push({
           title: book.volumeInfo.title,
           component: BookDetail,
           passProps: {book}
       });*/
   }
   
   renderBook(book) {
       return (
            <TouchableHighlight onPress={() => this.showBookDetail(book)}  underlayColor='#dddddd'>
                <View>
                    <View style={styles.container}>
                        <Image
                            source={{uri: book.volumeInfo.imageLinks.thumbnail}}
                            style={styles.thumbnail} />
                        <View style={styles.rightContainer}>
                            <Text style={styles.title}>{book.volumeInfo.title}</Text>
                            <Text style={styles.author}>{book.volumeInfo.authors}</Text>
                        </View>
                    </View>
                    <View style={styles.separator} />
                </View>
            </TouchableHighlight>
       );
   }
   renderLoadingView() {
    return (
        <View style={styles.loading}>
            <Text>
                Loading books...
            </Text>
        </View>
    );
}
  render() {
        if (this.state.isLoading) {
           return this.renderLoadingView();
       }
       return (
      <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderBook.bind(this)}
            style={styles.listView}
            />
    );
  }
}


let styles = StyleSheet.create({
    description: {
        fontSize: 20,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 10
    },
    thumbnail: {
        width: 53,
        height: 81,
        marginRight: 10
    },
    rightContainer: {
        backgroundColor: 'red'
    },
    separator: {
       height: 1,
       backgroundColor: '#dddddd'
   },
    title: {
        fontSize: 20,
        marginBottom: 8
    },
    listView: {
       backgroundColor: '#F5FCFF'
   },
   loading: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center'
   },
    author: {
        color: '#656565'
    }
});
//following line is not needed in expo; epo deals with this automatically
//AppRegistry.registerComponent('BookSearch', () => BookSearch);
//The above defines the entry point to the application. This is where the JavaScript code start executing
