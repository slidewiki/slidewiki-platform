import {BaseStore} from 'fluxible/addons';

class PresentationStore extends BaseStore {

    constructor(dispatcher) {
        super(dispatcher);
        this.content = '';
        this.theme = '';
    }
    updatePresentation(payload) {
        // console.log('Payload: ', payload);
        this.deck =
        this.flatTree = this.getFlatTree(this.deck);
        this.content = payload.content;
        this.theme = payload.theme;
        this.emitChange();
        //console.log("Updating content", payload.content);
    }

    getState() {
        return {
            items: this.items,
            selector: this.selector,
            mode: this.mode,
            content: this.content,
            theme: this.theme,
            deck: this.deck,
            flatTree: this.flatTree
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.items = state.items;
        this.selector = state.selector;
        this.mode = state.mode;
        this.content = state.content;
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
