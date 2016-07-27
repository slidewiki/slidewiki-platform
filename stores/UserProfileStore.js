import {BaseStore} from 'fluxible/addons';

class UserProfileStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.username = '';
        this.userid = '';
        this.jwt = '';
    }

    handleSignInSuccess(payload) {
        this.username = payload.username;
        this.userid = payload.userid;
        this.jwt = payload.jwt;
        this.emitChange();
    }

    getState() {
        return {
            username: this.username,
            userid: this.userid,
            jwt: this.jwt
        };
    }

    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.username = state.username;
        this.userid = state.userid;
        this.jwt = state.jwt;
    }
}

UserProfileStore.storeName = 'UserProfileStore';
UserProfileStore.handlers = {
    'SIGNIN_SUCCESS': 'handleSignInSuccess'
};

export default UserProfileStore;
