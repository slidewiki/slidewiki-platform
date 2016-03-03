class SlideControlUtil{
    //create previous slide path
    static prevSlidePath(selector, flatTree, mode) {
        let node, path;
        if(!selector.position || selector.position === 1){
            return 0;
        }else{
            node = flatTree[selector.position - 1];
            if(node.type === 'deck'){
                node = flatTree[selector.position - 2];
            }
            path = '/deck/' + selector.id + '/' + node.type + '/' + node.id + '/' + node.path + '/' + mode;
            return path;
        }
    }
    //create next slide path
    static nextSlidePath(selector, flatTree, mode) {
        let node, path;
        if(!flatTree[selector.position + 1]){
            return 0;
        }else{
            node = flatTree[selector.position + 1];
            if(node.type === 'deck'){
                node = flatTree[selector.position + 2];
            }
            path = '/deck/' + selector.id + '/' + node.type + '/' + node.id + '/' + node.path + '/' + mode;
            return path;
        }
    }
    //create last slide path
    static lastSlidePath(selector, flatTree, mode) {
        let node, path;
        node = flatTree[flatTree.length - 1];
        path = '/deck/' + selector.id + '/' + node.type + '/' + node.id + '/' + node.path + '/' + mode;
        return path;
    }
    //create first slide path
    static firstSlidePath(selector, flatTree, mode) {
        let node, path;
        node = flatTree[1];
        if(node.type === 'deck'){
            node = flatTree[2];
        }
        path = '/deck/' + selector.id + '/' + node.type + '/' + node.id + '/' + node.path + '/' + mode;
        return path;
    }
}
export default SlideControlUtil;
