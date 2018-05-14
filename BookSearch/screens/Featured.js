import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Component, ListView, TouchableHighlight, ActivityIndicator} from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';

var BookDetail = require('./BookDetail');

var REQUEST_URL = 'https://www.googleapis.com/books/v1/volumes?q=subject:fiction';

var styles = StyleSheet.create({
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
        flex: 1
    },
    title: {
        fontSize: 20,
        marginBottom: 8
    },

    separator: {
        height: 1,
        backgroundColor: '#dddddd'
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

export default class Featured extends React.Component {

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

    showBookDetail(book) {
        this.props.navigator.push({
            title: book.volumeInfo.title,
            component: BookDetail,
            passProps: {book}
        });
    }

    renderLoadingView() {
        return (
            <View style={styles.loading}>
                <ActivityIndicator
                    size='large'/>
                <Text>
                    Loading books...
                </Text>
            </View>
        );
    }
}