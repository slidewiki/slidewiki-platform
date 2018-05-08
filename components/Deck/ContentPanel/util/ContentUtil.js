import TranslationStore from '../../../../stores/TranslationStore';
import {connectToStores} from 'fluxible-addons-react';

class ContentUtil{
    //build URL based on the context
    static makeNodeURL(selector, mode, language) {
        let nodeURL;
        let query = '';
        language = language || this.props.TranslationStore.treeLanguage;
        if (language) {
            query = '?language=' + language;
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
ContentUtil = connectToStores(ContentUtil, [TranslationStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState()
    };
});
export default ContentUtil;
