import {BaseStore} from 'fluxible/addons';

class PresentationStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.content = '';
        this.theme = '';
        this.selector = '';
    }
    updatePresentation(payload) {
        this.content = payload.content;
        this.theme = payload.theme;
        this.selector = payload.selector;
        this.emitChange();
        //console.log("Updating content", payload.content);
    }

    getState() {
        return {
            items: this.items,
            selector: this.selector,
            mode: this.mode,
            content: this.content,
            theme: this.theme
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.items = state.items;
        this.selector = state.selector;
        this.content = state.content;
        this.theme = state.theme;
    }

    getFlatTree(deck){
        let flatTree = [];
        for (let d in deck) {
            if (d.type === 'slide') {
                flatTree.push(d.id);
            }
        }
        return flatTree;
    }

}

PresentationStore.storeName = 'PresentationStore';
PresentationStore.handlers = {
    'LOAD_PRESENTATION_SUCCESS': 'updatePresentation'
};

export default PresentationStore;
