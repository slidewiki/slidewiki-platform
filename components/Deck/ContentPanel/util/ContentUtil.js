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
            let index = query.indexOf('language=');
            if (index === -1)
                query = '?language=' + language + (query ? '&' + (query.startsWith('?') ? query.substring(1) : query) : '');
            else {
                let valueIndex = query.substring(index + 9).indexOf('&');
                if (valueIndex === -1)
                    query = query.substring(0, index + 9) + language;
                else
                    query = query.substring(0, index + 9) + language + query.substring(index + 9 + valueIndex);
            }
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
