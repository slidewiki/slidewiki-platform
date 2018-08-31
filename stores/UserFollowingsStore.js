import {BaseStore} from 'fluxible/addons';
import slugify from 'slugify';

class UserFollowingsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.deckFollowings = undefined;
        this.playlistFollowings = undefined;
        this.selectedFollowingId = null;
        this.loading = true;
    }
    showLoading(payload){
        this.loading = true;
        this.emitChange();
    }
    loadFollowings(payload) {
        this.loading = false;
        this.deckFollowings = [];
        this.playlistFollowings = [];
        payload.followings.forEach((following) => {
            if (following.followed_type === 'deck') {
                this.deckFollowings.push(following);
            } else if (following.followed_type === 'playlist') {
                this.playlistFollowings.push(following);
            }
        });
        this.selectedFollowingId = null;
        this.emitChange();
    }
    getFollowing(payload) {
        if (payload.followings.length > 0) {
            this.selectedFollowingId = payload.followings[0].id;
        } else {
            this.selectedFollowingId = null;
        }
        this.emitChange();
    }
    createFollowing(payload) {
        if (payload.id !== undefined && payload.id !== null) {
            this.selectedFollowingId = payload.id;
        } else {
            this.selectedFollowingId = null;
        }

        this.emitChange();
    }
    deleteFollowing(payload) {
        this.selectedFollowingId = null;

        //remove from the list
        let index = this.deckFollowings.findIndex((following) => {return (following.id === payload.id);});
        if (index === -1) {
            index = this.playlistFollowings.findIndex((following) => {return (following.id === payload.id);});
            if (index !== -1) {
                this.playlistFollowings.splice(index, 1);
            }
        } else {
            this.deckFollowings.splice(index, 1);
        }

        this.emitChange();
    }
    getState() {
        return {
            deckFollowings: this.deckFollowings,
            playlistFollowings: this.playlistFollowings,
            selectedFollowingId: this.selectedFollowingId,
            loading: this.loading
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.deckFollowings = state.deckFollowings;
        this.playlistFollowings = state.playlistFollowings;
        this.selectedFollowingId = state.selectedFollowingId;
        this.loading = state.loading;
    }
}

UserFollowingsStore.storeName = 'UserFollowingsStore';
UserFollowingsStore.handlers = {
    'LOAD_USER_FOLLOWINGS_SUCCESS': 'loadFollowings',
    'SHOW_FOLLOWINGS_LOADING': 'showLoading',
    'GET_FOLLOWING_SUCCESS': 'getFollowing',
    'LOAD_FOLLOWINGS_SUCCESS': 'loadFollowings',
    'CREATE_FOLLOWING_SUCCESS': 'createFollowing',
    'DELETE_FOLLOWING_SUCCESS': 'deleteFollowing'
};

export default UserFollowingsStore;
