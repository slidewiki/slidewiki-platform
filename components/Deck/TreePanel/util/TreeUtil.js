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
    //return the absolute position of the selector
    static calculateAbsPosition(flatTree, spath){
        let position = 0;
        for (let i=0; i < flatTree.size; i++) {
            if (flatTree.get(i).get('path') === spath) {
                position = i;
                return i;
            }
        }
        return position;
    }
    //create previous node path
    static prevNodePath(selector, flatTree, page, mode) {
        let position = this.calculateAbsPosition(flatTree, selector.get('spath'));
        let node, path;
        //do not select the root deck node
        if(position === 1){
            return 0;
        }else{
            node = flatTree.get(position  - 1);
            path = this.makeNodeURL({id: selector.get('id'), stype: node.get('type'), sid: node.get('id'), spath: node.get('path')}, page, mode);
            return path;
        }
    }
    //create next node path
    static nextNodePath(selector, flatTree, page, mode) {
        let position = this.calculateAbsPosition(flatTree, selector.get('spath'));
        let node, path;
        if(!flatTree.get(position + 1)){
            return 0;
        }else{
            node = flatTree.get(position + 1);
            path = this.makeNodeURL({id: selector.get('id'), stype: node.get('type'), sid: node.get('id'), spath: node.get('path')}, page, mode);
            return path;
        }
    }

}
export default TreeUtil;
