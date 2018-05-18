import {observable, action} from 'mobx';

class ApplicationState {
    @observable things = [];
    @observable loading_things = false;
    @observable things_error = "";

    @action getThings() {
        this.things = [];
        this.loading_things = true;
        return fetch('https://s3.amazonaws.com/aaronblondeau/react-native-quickly-1/things.json')
        .then((response) => response.json())
        .then(action((responseJson) => {
            this.loading_things = false;
            this.things = responseJson;
        }))
        .catch(action((error) => {
            this.things_error = error.message;
            this.loading_things = false;
            console.error(error);
        }));
    }
}

const state = new ApplicationState()
export default state