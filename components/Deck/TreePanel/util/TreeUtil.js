class TreeUtil{
    //parses the nodePath and builds to selector path for navigation
    static makeSelectorPath(nodePath) {
        let out = [], slectorPath = '';
        nodePath.forEach((element, index) => {
            out.push(element.join(':'));
        });
        slectorPath = out.join(';');
        return slectorPath;
    }
    //build node URL based on the context
    static makeNodeURL(selector, mode) {
        let nodeURL;
        //adapt URLs based on the current page
        switch (selector.page) {
            case 'deck':
                nodeURL = '/' + selector.page + '/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath + '/' + mode;
                break;
            case 'decktree':
                nodeURL = '/' + selector.page + '/' + selector.id + '/' + selector.spath;
                break;
            default:
                nodeURL = '/deck/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath + '/' + mode;
        }
        return nodeURL;
    }
    //create previous node path
    static prevNodePath(selector, flatTree, mode) {
        let node, path;
        if(!flatTree[selector.position - 1]){
            return 0;
        }else{
            node = flatTree[selector.position - 1];
            path = this.makeNodeURL({id: selector.id, stype: node.type, sid: node.id, spath: node.path, page: selector.page}, mode);
            return path;
        }
    }
    //create next node path
    static nextNodePath(selector, flatTree, mode) {
        let node, path;
        if(!flatTree[selector.position + 1]){
            return 0;
        }else{
            node = flatTree[selector.position + 1];
            path = this.makeNodeURL({id: selector.id, stype: node.type, sid: node.id, spath: node.path, page: selector.page}, mode);
            return path;
        }
    }
}
export default TreeUtil;
