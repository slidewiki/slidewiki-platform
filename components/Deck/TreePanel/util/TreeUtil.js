class TreeUtil{
    //build node URL based on the context
    static makeNodeURL(selector, page, mode) {
        let nodeURL;
        //adapt URLs based on the current page
        switch (page) {
            case 'deck':
                if(selector.spath){
                    nodeURL = '/' + page + '/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath + '/' + mode;
                }else{
                    //for root node
                    nodeURL = '/' + page + '/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + mode;
                }
                break;
            default:
                nodeURL = '/decktree/' + selector.id + '/' + selector.spath;
        }
        return nodeURL;
    }
    //tood: should be consistent with identical methods on deck tree store
    static getImmNodeFromPath(deckTree, path) {
        if(!path){
            //in case of root deck selected
            return deckTree;
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
        let chain = deckTree;
        out.forEach((item, index) => {
            //chain will be a list of all nodes in the same level
            chain = chain.get(item);
        });
        return chain;
    }
}
export default TreeUtil;
