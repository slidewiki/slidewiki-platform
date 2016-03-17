import {BaseStore} from 'fluxible/addons';
import Immutable from 'immutable';

class DeckTreeStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.selector = Immutable.fromJS({});;
        this.prevSelector = Immutable.fromJS({});
        this.nextSelector = Immutable.fromJS({});
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
        //prepare next and prev node selector
        this.prevSelector = this.makeSelectorFromNode(this.findPrevNode(this.flatTree, this.selector));
        this.nextSelector = this.makeSelectorFromNode(this.findNextNode(this.flatTree, this.selector));
        this.emitChange();
    }
    //deckTree: original deckTree from service without path
    //path: array of binary id:position
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
    //deckTree: immutable deckTree with path strings -> it is used to update the path
    //path: array of binary id:position
    updatePathForImmTree(deckTree, path) {
        let nodePath = this.makeSelectorPathString(path);
        let newTree = {id: deckTree.get('id'), title: deckTree.get('title'), type: deckTree.get('type'), path: nodePath, selected: deckTree.get('selected'), editable: deckTree.get('editable')};
        if (deckTree.get('type') === 'deck') {
            newTree.children = [];
            newTree.expanded = deckTree.get('expanded');
            deckTree.get('children').forEach((item, index) => {
                newTree.children.push(this.updatePathForImmTree(item, path.concat([[item.get('id'), index + 1]])) );
            });
        }
        return Immutable.fromJS(newTree);
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
    //used for recursive path building
    makePathArrFromString(pathStr) {
        let out = [];
        let arr = pathStr.split(';');
        arr.forEach((element, index) => {
            out.push(element.split(':'));
        });
        return out;
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
    calculateNodeAbsPosition(flatTree, spath){
        let position = 0;
        for (let i=0; i < flatTree.size; i++) {
            if (flatTree.get(i).get('path') === spath) {
                position = i;
                return i;
            }
        }
        return position;
    }
    findPrevNode(flatTree, selector) {
        let position = this.calculateNodeAbsPosition(flatTree, selector.get('spath'));
        let node;
        //do not select the root deck node
        if(position === 0){
            node = flatTree.get(0);
        }else{
            node = flatTree.get(position  - 1);
        }
        return node;
    }
    findNextNode(flatTree, selector) {
        let position = this.calculateNodeAbsPosition(flatTree, selector.get('spath'));
        let node = flatTree.get(position + 1);
        if(!node){
            node = flatTree.get(0);
        }
        return node;
    }
    makeSelectorFromNode(node) {
        return Immutable.fromJS({'id': this.deckTree.get('id'), 'spath': node.get('path'), 'sid': node.get('id'), 'stype': node.get('type')});
    }
    findParentNodeSelector(spath) {
        let arr = spath.split(';');
        //root deck is parent
        if(arr.length <= 1){
            return Immutable.fromJS({'id': this.deckTree.get('id'), 'spath': this.deckTree.get('path'), 'sid': this.deckTree.get('id'), 'stype': 'deck'});
        }else{
            arr.splice(-1,1);
            let parentPath = arr.join(';');
            let parentPart = parentPath[parentPath.length-1];
            return Immutable.fromJS({'id': this.deckTree.get('id'), 'spath': parentPath, 'sid': parentPart.split(':')[0], 'stype': 'deck'});
        }
    }
    //extracts the position from path string
    getRelPositionFromPath(spath) {
        let arr = spath.split(';');
        if(!arr.length){
            return 1;
        }else{
            return arr[arr.length - 1].split(':')[1];
        }
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
        //update prev/next selectors
        this.prevSelector = this.makeSelectorFromNode(this.findPrevNode(this.flatTree, this.selector));
        this.nextSelector = this.makeSelectorFromNode(this.findNextNode(this.flatTree, this.selector));
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
        let selectedRelPosition = this.getRelPositionFromPath(selectorIm.get('spath')) - 1;
        let selectedNodeIndex = this.makeImmSelectorFromPath(selectorIm.get('spath'));
        //select new one
        this.deckTree = this.deckTree.deleteIn(selectedNodeIndex);
        //should also update the path of all nodes which are in the same level
        //first, update the selector to find all nodes in the same level: remove the last item
        selectedNodeIndex.splice(-1,1);
        let chain = this.deckTree;
        selectedNodeIndex.forEach((item, index) => {
            //chain will be a list of all nodes in the same level
            chain = chain.get(item);
        });
        chain.forEach((item, index) => {
            //only update the nodes in same level which come after the selected node
            if(index >= selectedRelPosition){
                let newPath = this.updateNodeRelPosition(item.get('path'), index+1);
                //todo: only appy it to the nodes which were positioned after the selected node
                this.deckTree = this.deckTree.updateIn(selectedNodeIndex.concat(index), (node) => node.update('path', (val) => newPath));
                if(item.get('type') === 'deck'){
                    this.deckTree = this.deckTree.setIn(selectedNodeIndex.concat(index), this.updatePathForImmTree(item, this.makePathArrFromString(newPath)));
                }
            }
        });
        //should update the selector: set to parent node
        this.selector = this.findParentNodeSelector(this.selector.get('spath'));
        //update the selected node in tree
        selectedNodeIndex = this.makeImmSelectorFromPath(this.selector.get('spath'));
        this.deckTree = this.deckTree.updateIn(selectedNodeIndex,(node) => node.update('selected', (val) => true));
        //need to update flat tree for node absolute positions
        this.flatTree = Immutable.fromJS(this.flattenTree(this.deckTree));
        this.emitChange();
    }
    updateNodeRelPosition(path, newPosition) {
        let arr = path.split(';');
        let lastNode = arr[arr.length - 1];
        arr.splice(-1,1);
        arr.push(lastNode.split(':')[0] + ':' + newPosition);
        return arr.join(';');
    }
    getState() {
        return {
            deckTree: this.deckTree,
            selector: this.selector,
            flatTree: this.flatTree,
            prevSelector: this.prevSelector,
            nextSelector: this.nextSelector
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.deckTree = Immutable.fromJS(state.deckTree);
        this.selector = Immutable.fromJS(state.selector);
        this.flatTree = Immutable.fromJS(state.flatTree);
        this.prevSelector = Immutable.fromJS(state.prevSelector);
        this.nextSelector = Immutable.fromJS(state.nextSelector);
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
