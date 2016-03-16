import {BaseStore} from 'fluxible/addons';
import Immutable from 'immutable';

class DeckTreeStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.selector = Immutable.fromJS({});;
        this.flatTree = Immutable.fromJS([]);
        this.deckTree = Immutable.fromJS({});
    }
    updateDeckTree(payload) {
        this.selector = Immutable.fromJS(payload.selector);
        //add path to tree nodes
        this.deckTree = Immutable.fromJS(this.makePathForTree(payload.deckTree, []));
        this.flatTree = Immutable.fromJS(this.flattenTree(this.deckTree));
        //set a default path in case of no path
        if(!payload.selector.spath){
            this.selector = this.selector.setIn(['spath'], this.generateASelectorPath(this.flatTree, this.selector));
        }
        //update the selected node in tree
        let selectedNodeIndex = this.makeImmSelectorFromPath(this.selector.get('spath'));
        this.deckTree = this.deckTree.updateIn(selectedNodeIndex,(node) => node.update('selected', (val) => true));
        this.emitChange();
    }
    makePathForTree(deckTree, path) {
        let nodePath = this.makeSelectorPathString(path);
        let newTree = {id: deckTree.id, title: deckTree.title, type: deckTree.type, path: nodePath, selected: false, editable: false};
        if (deckTree.type === 'deck') {
            newTree.children = [];
            newTree.expanded = true;
            deckTree.children.forEach((item, index) => {
                newTree.children.push(this.makePathForTree(item, path.concat([[item.id, index + 1]])) );
            });
        }
        return newTree;
    }
    //flat tree is used to avoid complex recursive functions on tree
    //it is a trade off: updating the tree needs this to be synchronized
    flattenTree(deckTree) {
        let list = [];
        list.push({id: deckTree.get('id'), title: deckTree.get('title'), type: deckTree.get('type'), path: deckTree.get('path')});
        if (deckTree.get('type') === 'deck') {
            deckTree.get('children').forEach((item, index) => {
                list = list.concat(this.flattenTree(item));
            });
        }
        return list;
    }
    //generates a selector path if needed (uses flatTree search)
    //returns the first occurance
    generateASelectorPath(flatTree, selector) {
        let spath = '';
        for (let i=0; i < flatTree.size; i++) {
            if ((flatTree.get(i).get('type') === selector.get('stype')) && (parseInt(flatTree.get(i).get('id')) === parseInt(selector.get('sid')))) {
                spath = flatTree.get(i).get('path');
                return spath;
            }
        }
        return spath;
    }
    //parses the nodePath and builds to selector path for navigation
    makeSelectorPathString(nodePath) {
        let out = [], slectorPath = '';
        nodePath.forEach((element, index) => {
            out.push(element.join(':'));
        });
        slectorPath = out.join(';');
        return slectorPath;
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
    selectTreeNode(args) {
        let oldSelector = this.selector;
        this.selector = Immutable.fromJS({'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype});
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
    deleteTreeNode(selector) {
        let selectorIm = Immutable.fromJS(selector);
        let selectedNodeIndex = this.makeImmSelectorFromPath(selectorIm.get('spath'));
        //select new one
        this.deckTree = this.deckTree.deleteIn(selectedNodeIndex);
        //need to update flat tree for node absolute positions
        this.flatTree = Immutable.fromJS(this.flattenTree(this.deckTree));
        //should also update the position of all nodes which are in the same level
        //first, update the selector to find all nodes in the same level: remove the last item
        //selectedNodeIndex.splice(-1,1);
        // this.deckTree = this.deckTree.updateIn(selectedNodeIndex,(list) => console.log(list));
        // console.log('qwe', selectedNodeIndex);
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
    'SAVE_TREE_NODE_SUCCESS': 'saveTreeNode',
    'DELETE_TREE_NODE_SUCCESS': 'deleteTreeNode'
};

export default DeckTreeStore;
