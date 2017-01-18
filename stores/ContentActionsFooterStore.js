import {BaseStore} from 'fluxible/addons';

class ContentActionsFooterStore extends BaseStore{
    constructor(dispatcher) {
        super(dispatcher);
        this.state={expanded: 0}; //0 collapsed view; 1 expanded view
    }
    getState() {
        return {
            state: this.state
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.state = state.state;
    }
    setCollapsed(){
        this.state.expanded = 0;
    }

    setExpanded(){
        this.state.expanded = 1;
    }


}

ContentActionsFooterStore.storeName = 'ContentActionsFooterStore';
ContentActionsFooterStore.handlers = {
    'EXPAND_CONTENET_PANEL' : 'setExpanded',
    'RESTORE_DECK_PAGE_LAYOUT' : 'setCollapsed'
};
export default ContentActionsFooterStore;
