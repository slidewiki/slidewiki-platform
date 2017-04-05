class ContentUtil{
    //build URL based on the context
    static makeNodeURL(selector, mode) {
        let nodeURL;
        //adapt URLs based on the current page
        switch (selector.page) {
            case 'deck':
                if(selector.spath){
                    nodeURL = '/' + selector.page + '/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath + '/' + mode;
                }else{
                    nodeURL = '/' + selector.page + '/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + mode;
                }
                break;
            case 'contentmode':
            //Deliberately falls through to content              
            case 'content':
                nodeURL = '/' + selector.page + '/' + selector.stype + '/' + selector.sid + '/' + mode;
                break;
            default:
                if(selector.spath){
                    nodeURL = '/deck/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath + '/' + mode;
                }else{
                    nodeURL = '/deck/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + mode;
                }
        }
        return nodeURL;
    }
}
export default ContentUtil;
