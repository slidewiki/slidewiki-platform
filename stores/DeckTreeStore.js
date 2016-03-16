import {BaseStore} from 'fluxible/addons';
import Immutable from 'immutable';

class DeckTreeStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.selector = Immutable.fromJS({});;
        this.deckTree = Immutable.fromJS({});
        this.flatTree = Immutable.fromJS([]);
    }
    updateDeckTree(payload) {
        this.selector = Immutable.fromJS(payload.selector);
        //flatten the deck tree
        this.flatTree = Immutable.fromJS((this.flattenTree(payload.deckTree, [])));
        //set a default path in case of no path
        if(!payload.selector.spath){
            this.selector = this.selector.setIn(['spath'], this.generateASelector());
        }
        //find the absolute position of selector
        this.selector = this.selector.setIn(['position'], this.calculateAbsPosition(this.selector.get('spath')));
        //add path to tree nodes, waits for the selector path assignement
        this.deckTree = Immutable.fromJS(this.makePathForTree(payload.deckTree, []));
        this.emitChange();
    }
    //return the absolute position of the selector
    calculateAbsPosition(spath){
        let position = 0;
        for (let i=0; i < this.flatTree.size; i++) {
            if (this.flatTree.get(i).get('path') === spath) {
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
    //fill in the selector if needed
    generateASelector() {
        let spath = '';
        for (let i=0; i < this.flatTree.size; i++) {
            if ((this.flatTree.get(i).get('type') === this.selector.get('stype')) && (this.flatTree.get(i).get('id') === parseInt(this.selector.get('sid')))) {
                spath = this.flatTree.get(i).get('path');
                return spath;
            }
        }
        return spath;
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
    makePathForTree(deckTree, path) {
        let nodePath = this.makeSelectorPath(path);
        let newTree = {id: deckTree.id, title: deckTree.title, type: deckTree.type, path: nodePath, selected: nodePath === this.selector.get('spath'), editable: false};
        if (deckTree.type === 'deck') {
            newTree.children = [];
            newTree.expanded = true;
            deckTree.children.forEach((item, index) => {
                newTree.children.push(this.makePathForTree(item, path.concat([[item.id, index + 1]])) );
            });
        }
        return newTree;
    }
    selectTreeNode(args) {
        let oldSelector = this.selector;
        this.selector = Immutable.fromJS({'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'position': this.calculateAbsPosition(args.spath)});
        // get the index for target nodes
        let oldSelectedNodeIndex = this.makeImmSelectorFromPath(oldSelector.get('spath'));
        let newSelectedNodeIndex = this.makeImmSelectorFromPath(this.selector.get('spath'));
        //update the immutable objects
        //deselect old one
        this.deckTree = this.deckTree.updateIn(oldSelectedNodeIndex,(node) => node.update('selected', (val) => false));
        //select new one
        this.deckTree = this.deckTree.updateIn(newSelectedNodeIndex,(node) => node.update('selected', (val) => true));
        this.emitChange();
    }
    toggleTreeNode(selector) {
        let selectorIm = Immutable.fromJS(selector);
        let selectedNodeIndex = this.makeImmSelectorFromPath(selectorIm.get('spath'));
        //select new one
        this.deckTree = this.deckTree.updateIn(selectedNodeIndex,(node) => node.update('expanded', (val) => ! val));
        this.emitChange();
    }
    renameTreeNode(selector) {
        let selectorIm = Immutable.fromJS(selector);
        let selectedNodeIndex = this.makeImmSelectorFromPath(selectorIm.get('spath'));
        //select new one
        this.deckTree = this.deckTree.updateIn(selectedNodeIndex,(node) => node.update('editable', (val) => true));
        this.emitChange();
    }
    saveTreeNode(payload) {
        let selectorIm = Immutable.fromJS(payload.selector);
        let selectedNodeIndex = this.makeImmSelectorFromPath(selectorIm.get('spath'));
        //select new one
        this.deckTree = this.deckTree.updateIn(selectedNodeIndex,(node) => node.update('editable', (val) => false));
        this.deckTree = this.deckTree.updateIn(selectedNodeIndex,(node) => node.update('title', (val) => payload.newValue));
        this.emitChange();
    }
    //e.x. path: 68:3;685:2;691:2
    makeImmSelectorFromPath(path) {
        if(!path){
            //in case of root deck selected
            return [];
        }
        let out=['children'];
        let tmp, arr = path.split(';');
        arr.forEach((item, index) => {
            tmp = item.split(':');
            out.push(parseInt(tmp[1]-1));
            if(index !== (arr.length - 1)){
                //last item is always a slide, remaining are decks
                out.push('children');
            }
        });
        return out;
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
        this.deckTree = Immutable.fromJS(state.deckTree);
        this.selector = Immutable.fromJS(state.selector);
        this.flatTree = Immutable.fromJS(state.flatTree);
    }
}

DeckTreeStore.storeName = 'DeckTreeStore';
DeckTreeStore.handlers = {
    'LOAD_DECK_TREE_SUCCESS': 'updateDeckTree',
    'SELECT_TREE_NODE_SUCCESS': 'selectTreeNode',
    'TOGGLE_TREE_NODE_SUCCESS': 'toggleTreeNode',
    'RENAME_TREE_NODE_SUCCESS': 'renameTreeNode',
    'SAVE_TREE_NODE_SUCCESS': 'saveTreeNode'
};

export default DeckTreeStore;
