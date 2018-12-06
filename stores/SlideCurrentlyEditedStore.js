import {BaseStore} from 'fluxible/addons';

class SlideCurrentlyEditedStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.eventId = '';
        this.slideCurrentlyEditedId = '';
        this.usersCurrentlyEditing = [];
    }
    destructor() {
        this.eventId = '';
        this.slideCurrentlyEditedId = '';
        this.usersCurrentlyEditing = [];
    }
    getState() {
        return {
            eventId: this.eventId,
            slideCurrentlyEditedId: this.slideCurrentlyEditedId,
            usersCurrentlyEditing: []
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.eventId = state.eventId;
        this.slideCurrentlyEditedId = state.slideCurrentlyEditedId;
        this.usersCurrentlyEditing = state.usersCurrentlyEditing;
    }

    getUsersEditingSlide(params) {
        this.slideCurrentlyEditedId = params.slideCurrentlyEditedId;
        this.usersCurrentlyEditing = params.usersCurrentlyEditing;
        this.emitChange();
    }

}

SlideCurrentlyEditedStore.storeName = 'SlideCurrentlyEditedStore';

SlideCurrentlyEditedStore.handlers =  {
    'GET_USERS_EDITING_SLIDE': 'getUsersEditingSlide'
};

export default SlideCurrentlyEditedStore;
