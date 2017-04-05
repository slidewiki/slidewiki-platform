import {BaseStore} from 'fluxible/addons';

class ContentLikeStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);

        this.usersWhoLikedDeck = [];
    }
    updateLike(payload) {
        //payload with user ID
        if (this.usersWhoLikedDeck.indexOf(payload.userid) === -1) {
            this.usersWhoLikedDeck.push(String(payload.userid));
        }

        this.emitChange();
    }

    updateDislike(payload) {
        //payload with user ID
        if (this.usersWhoLikedDeck.indexOf(payload.userid) !== -1) {
            this.usersWhoLikedDeck.splice(this.usersWhoLikedDeck.indexOf(String(payload.userid)),1);
        }

        this.emitChange();
    }

    loadLikes(payload) {
        //payload wiht list of user IDs
        this.usersWhoLikedDeck = [];
        this.usersWhoLikedDeck = this.usersWhoLikedDeck.concat(payload.usersWhoLikedDeck);

        this.emitChange();
    }

    getState() {
        return {
            usersWhoLikedDeck: this.usersWhoLikedDeck,
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.usersWhoLikedDeck = state.usersWhoLikedDeck;
    }
    handleDeckParamErrors(err) {
        this.emitChange();
    }
}

ContentLikeStore.storeName = 'ContentLikeStore';
ContentLikeStore.handlers = {
    'LIKE_ACTIVITY_SUCCESS': 'updateLike',
    'DISLIKE_ACTIVITY_SUCCESS': 'updateDislike',
    'LIKE_LOAD_SUCCESS': 'loadLikes'
};

export default ContentLikeStore;
