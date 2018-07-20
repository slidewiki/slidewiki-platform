class Util{
    //build URL based on the context
    static makeNodeURL(selector, page, mode, slug, language, defaultIsDecktree = false) {
        if (!slug) slug = '_';
        if (mode === undefined) {console.log('Util.makeNodeURL without mode', selector, page, slug, language); mode = '';}

        let nodeURL;

        //handle query
        let query = '';
        try {
            query = location.search;
        } catch (e) {
            try {
                query = window.location.search;
            } catch (e) {}
        }
        if (language !== undefined) {
            let index = query.indexOf('language=');
            if (language === '') {
                //remove from query
                if (index > -1) {
                    let valueIndex = query.substring(index + 9).indexOf('&');
                    if (valueIndex === -1)
                        query = query.substring(0, index);
                    else
                        query = query.substring(0, index) + query.substring(index + 9 + valueIndex);
                }
            }
            else if (index === -1)
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
        switch (page) {
            case 'deck':
                if(selector.spath){
                    nodeURL = '/' + page + '/' + selector.id + '/' + slug + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath + '/' + mode + query;
                }else{
                    nodeURL = '/' + page + '/' + selector.id + '/' + slug + '/' + selector.stype + '/' + selector.sid + '/' + mode + query;
                }
                break;
            case 'plaindeck':
                nodeURL = '/deck/' + selector.id + '/' + slug + query;
                break;
            case 'contentmode':
            //Deliberately falls through to content
            case 'content':
                nodeURL = '/' + page + '/' + selector.stype + '/' + selector.sid + '/' + mode + query;
                break;
            case 'decktree':
                nodeURL = '/decktree/' + selector.id + '/' + selector.spath + query;
                break;
            default:
                if (defaultIsDecktree)
                    nodeURL = '/decktree/' + selector.id + '/' + selector.spath + query;
                else
                    if(selector.spath) {
                        nodeURL = '/deck/' + selector.id + '/' + slug + '/' + selector.stype + '/' + selector.sid + '/' + selector.spath + '/' + mode + query;
                    }
                    else {
                        nodeURL = '/deck/' + selector.id + '/' + slug + '/' + selector.stype + '/' + selector.sid + '/' + mode + query;
                    }
        }
        return nodeURL;
    }
}
export default Util;
