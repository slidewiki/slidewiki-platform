import async from 'async';
import {shortTitle} from '../../configs/general';
import {navigateAction} from 'fluxible-router';
import striptags from 'striptags';

export default function saveSlide(context, payload, done) {

    context.service.update('slide.content', payload, {timeout: 20 * 1000}, (err, res) => {

        if (err) {
            context.dispatch('SAVE_SLIDE_EDIT_FAILURE', err);
        } else {
            console.log('qwe', payload, res);
            context.dispatch('SAVE_SLIDE_EDIT_SUCCESS', res);
            //TODO: retrieve the new revision number from deck-service and send it to decktree
            context.dispatch('UPDATE_TREE_NODE_SUCCESS', {selector: payload.selector, nodeSpec: {title: striptags(payload.title), id: payload.id}});
            //update the URL: redirect to view after edit
            let newURL = '/deck/' + res.selector.id + '/' + res.selector.stype + '/' + res.selector.sid + '/' + res.selector.spath;
            context.executeAction(navigateAction, {
                url: newURL
            });
        }
        //let pageTitle = shortTitle + ' | Slide Edit | ' + payload.params.sid;
        let pageTitle = shortTitle + ' | Slide Edit | ';
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    }

  );
}
