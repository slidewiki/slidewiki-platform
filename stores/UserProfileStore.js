import { BaseStore } from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.toShow = 'settings';
        this.user = {
            uname: 'rmeissn',
            fname: 'Roy',
            lname: 'Meissner',
            email: 'roy-meissner@who.me',
            lang: 'de_DE',
            location: 'Germany',
            hometown: 'Leipzig',
            orga: 'InfAI',
            picture: 'https://avatars2.githubusercontent.com/u/855967?v=3&s=460'
        };
        this.userDeleted = false;
    }

    destructor() {
        this.toShow = 'deck';
        this.user = {
            uname: '',
            fname: '',
            lname: '',
            email: '',
            lang: '',
            location: '',
            hometown: '',
            orga: '',
            picture: ''
        };
        this.userDeleted = false;
    }

    getState() {
        return { toShow: this.toShow, user: this.user };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.toShow = state.toShow;
        this.user = state.user;
    }

    changeTo(payload) {
        this.toShow = payload.dest;
        this.emitChange();
    }

    userDeleted(payload){
        this.userDeleted = true;
        this.emitChange();
    }

    userDeleteFailed(payload){
    }

    fillInUser(payload){
        this.user.uname = '';
        this.user.fname = '';
        this.user.lname = '';
        this.user.email = '';
        this.user.lang = '';
        this.user.location = '';
        this.user.hometown = '';
        this.user.orga = '';
        this.user.picture = '';
        this.emitChange();
    }
    removePicture(){
        this.user.picture = '';
        this.emitChange();
    }
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'CHANGE_TO': 'changeTo',
    'DELETE_USER_SUCCESS': 'userDeleted',
    'DELETE_USER_FAILURE': 'userDeleteFailed',
    'REMOVE_PICTURE': 'removePicture'
};

export default UserProfileStore;
