import {BaseStore} from 'fluxible/addons';
import _ from 'lodash';

class DeckTreeStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.selector = {};
        this.deckTree = {};
        this.flatTree = [];
    }
    updateDeckTree(payload) {
        this.deckTree = payload.deckTree;
        //todo: build a default selector (spath) if selector is not defined
        this.selector = payload.selector;
        //flatten th deck tree
        this.flatTree = this.flattenTree(payload.deckTree, []);
        this.selector.position = this.calculateAbsPosition(this.selector.spath);
        this.emitChange();
    }
    //parses the nodePath and builds to selector path for navigation
    makeSelectorPath(nodePath) {
        let out = [], slectorPath = '';
        nodePath.forEach((element, index) => {
            out.push(element.join(':'));
        });
        slectorPath = out.join(';');
        return slectorPath;
    }
    //return the absolute position of the selector
    calculateAbsPosition(spath){
        let position = 0;
        for (let i=0; i < this.flatTree.length; i++) {
            if (this.flatTree[i].path === spath) {
                position = i;
                return i;
            }
        }
        return position;
    }
    //this is helpful for next and prev within tree
    flattenTree(deckTree, path) {
        let list = [];
        list.push({id: deckTree.id, title: deckTree.title, type: deckTree.type, path: this.makeSelectorPath(path)});
        if (deckTree.type === 'deck') {
            deckTree.children.forEach((item, index) => {
                list = list.concat(this.flattenTree(item, path.concat([[item.id, index + 1]])));
            });
        }
        return list;
    }
    selectTreeNode(args) {
        this.selector = {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode, 'position': this.calculateAbsPosition(args.spath)};
        this.emitChange();
    }
    getState() {
        return {
            deckTree: this.deckTree,
            selector: this.selector,
            flatTree: this.flatTree
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.deckTree = state.deckTree;
        this.selector = state.selector;
        this.flatTree = state.flatTree;
    }
}

DeckTreeStore.storeName = 'DeckTreeStore';
DeckTreeStore.handlers = {
    'LOAD_DECK_TREE_SUCCESS': 'updateDeckTree',
    'SELECT_TREE_NODE_SUCCESS': 'selectTreeNode'
};

export default DeckTreeStore;
