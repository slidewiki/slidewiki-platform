import { BaseStore } from 'fluxible/addons';

class UserReviewStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);

        this.dimmer = {
            approve: false,
            suspend: false,
            keepreviewing: false,
            noreviewables: undefined
        };
        this.username = '';
        this.userid = '';
        this.secret = '';
        this.secretCorrect = false;
        this.reviewable = false;
    }

    getState() {
        return {
            dimmer: this.dimmer,
            username: this.username,
            userid: this.userid,
            secret: this.secret,
            secretCorrect: this.secretCorrect,
            reviewable: this.reviewable
        };
    }

    dehydrate() {
        return this.getState();
    }

    rehydrate(state) {
        this.dimmer = state.dimmer;
        this.username = state.username;
        this.userid = state.userid;
        this.secret = state.secret;
        this.secretCorrect = state.secretCorrect;
        this.reviewable = state.reviewable;
    }

    suspendSuccess(payload) {
        this.dimmer.suspend = true;
        this.username = '';
        this.userid = '';
        this.reviewable = false;
        this.emitChange();
        this.dimmer.suspend = false;
    }

    approveSuccess(payload) {
        this.dimmer.approve = true;
        this.username = '';
        this.userid = '';
        this.reviewable = false;
        this.emitChange();
        this.dimmer.approve = false;
    }

    keepReviewingSuccess(payload) {
        this.dimmer.keepreviewing = true;
        this.username = '';
        this.userid = '';
        this.reviewable = false;
        this.emitChange();
        this.dimmer.keepreviewing = false;
    }

    nextReviewableUserSuccess(payload) {
        this.secretCorrect = payload.secretCorrect;
        this.secret = payload.secret;
        if (payload.user) {
            this.username = payload.user.username;
            this.userid = payload.user.userid;
            this.reviewable = true;
            this.dimmer.noreviewables = false;
        } else {
            this.dimmer.noreviewables = true;
        }
        this.emitChange();
    }

    readUserSuccess(payload) {
        this.username = payload.username;
        this.userid = payload.userid;
        this.reviewable = payload.reviewable;
        this.dimmer.noreviewables = false;

        this.emitChange();
    }

    saveSecret(payload) {
        this.secret = payload.secret;



//////////////////////////////////
this.secretCorrect = true;


    }
}

UserReviewStore.storeName = 'UserReviewStore';
UserReviewStore.handlers = {
    'APPROVE_SUCCESS': 'approveSuccess',
    'SUSPEND_SUCCESS': 'suspendSuccess',
    'KEEP_REVIEWING_SUCCESS': 'keepReviewingSuccess',
    'NEXT_REVIEWABLE_USER_SUCCESS': 'nextReviewableUserSuccess',
    'READ_USER_SUCCESS': 'readUserSuccess',
    'SAVE_SECRET': 'saveSecret'
};

export default UserReviewStore;
