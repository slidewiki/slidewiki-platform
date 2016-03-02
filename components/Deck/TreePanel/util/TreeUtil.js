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
    //create previous node path
    static prevNodePath(selector, flatTree) {
        let node, path;
        if(!flatTree[selector.position - 1]){
            return 0;
        }else{
            node = flatTree[selector.position - 1];
            path = '/deck/' + selector.id + '/' + node.type + '/' + node.id + '/' + node.path;
            return path;
        }
    }
    //create next node path
    static nextNodePath(selector, flatTree) {
        let node, path;
        if(!flatTree[selector.position + 1]){
            return 0;
        }else{
            node = flatTree[selector.position + 1];
            path = '/deck/' + selector.id + '/' + node.type + '/' + node.id + '/' + node.path;
            return path;
        }
    }
}
export default TreeUtil;
