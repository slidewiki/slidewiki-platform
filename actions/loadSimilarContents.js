import {shortTitle} from '../configs/general';
import getSlideThumbnail from './getSlideThumbnail';

export default function loadSimilarContents(context, payload, done) {
    context.service.read('similarcontent.list', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('LOAD_SIMILAR_CONTENT_FAILURE', err);
        } else {
            context.dispatch('LOAD_SIMILAR_CONTENT_SUCCESS', res);
            for(let {id,title,author,authorId,date,liked,downloaded,imgSrc} of res.contents){
              context.executeAction(getSlideThumbnail,{sid:id},done);
            }
          
        }
        let pageTitle = shortTitle + ' | Similar Content | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
