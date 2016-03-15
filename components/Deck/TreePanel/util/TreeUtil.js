class TreeUtil{
    //build node URL based on the context
    static makeNodeURL(selector, page, mode) {
        let nodeURL;
        //adapt URLs based on the current page
        switch (page) {
            case 'deck':
                nodeURL = '/' + page + '/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath + '/' + mode;
                break;
            default:
                nodeURL = '/decktree/' + selector.id + '/' + selector.spath;
        }
        return nodeURL;
    }
    //create previous node path
    static prevNodePath(selector, flatTree, page, mode) {
        let node, path;
        //do not select the root deck node
        if(selector.get('position') === 1){
            return 0;
        }else{
            node = flatTree.get(selector.get('position')  - 1);
            path = this.makeNodeURL({id: selector.get('id'), stype: node.get('type'), sid: node.get('id'), spath: node.get('path')}, page, mode);
            return path;
        }
    }
    //create next node path
    static nextNodePath(selector, flatTree, page, mode) {
        let node, path;
        if(!flatTree.get(selector.get('position') + 1)){
            return 0;
        }else{
            node = flatTree.get(selector.get('position') + 1);
            path = this.makeNodeURL({id: selector.get('id'), stype: node.get('type'), sid: node.get('id'), spath: node.get('path')}, page, mode);
            return path;
        }
    }
}
export default TreeUtil;
