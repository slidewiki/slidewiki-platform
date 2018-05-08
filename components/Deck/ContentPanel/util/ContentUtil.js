class ContentUtil{
    //build URL based on the context
    static makeNodeURL(selector, mode, language) {
        let nodeURL;
        let query = '';
        try {
            query = location.search;
        } catch (e) {
            try {
                query = window.location.search;
            } catch (e) {}
        }
        if (language) {
            query = '?language=' + language + (query ? '&' + (query.startsWith('?') ? query.substring(1) : query) : '');
        }
        //adapt URLs based on the current page
        switch (selector.page) {
            case 'deck':
                if(selector.spath){
                    nodeURL = '/' + selector.page + '/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath + '/' + mode + query;
                }else{
                    nodeURL = '/' + selector.page + '/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + mode + query;
                }
                break;
            case 'contentmode':
            //Deliberately falls through to content
            case 'content':
                nodeURL = '/' + selector.page + '/' + selector.stype + '/' + selector.sid + '/' + mode + query;
                break;
            default:
                if(selector.spath){
                    nodeURL = '/deck/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath + '/' + mode + query;
                }else{
                    nodeURL = '/deck/' + selector.id + '/' + selector.stype + '/' + selector.sid + '/' + mode + query;
                }
        }
        return nodeURL;
    }
}
export default ContentUtil;
