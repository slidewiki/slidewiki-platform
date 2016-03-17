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
}
export default TreeUtil;
