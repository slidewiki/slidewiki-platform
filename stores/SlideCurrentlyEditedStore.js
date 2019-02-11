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
            usersCurrentlyEditing: this.usersCurrentlyEditing
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

    updateEventId(params) {
        this.eventId = params.eventId;
        this.emitChange();
    }

    getUsersEditingSlide(params) {
        this.slideCurrentlyEditedId = params.slideCurrentlyEditedId;
        this.usersCurrentlyEditing = params.usersCurrentlyEditing;
        this.emitChange();
    }

}

SlideCurrentlyEditedStore.storeName = 'SlideCurrentlyEditedStore';

SlideCurrentlyEditedStore.handlers =  {
    'UPDATE_EVENT_ID': 'updateEventId',
    'GET_USERS_EDITING_SLIDE': 'getUsersEditingSlide'

};

export default SlideCurrentlyEditedStore;
