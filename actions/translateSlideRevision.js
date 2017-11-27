import UserProfileStore from '../stores/UserProfileStore';
import ContentStore from '../stores/ContentStore';
import striptags from 'striptags';
import TreeUtil from '../components/Deck/TreePanel/util/TreeUtil';
import {navigateAction} from 'fluxible-router';
import serviceUnavailable from './error/serviceUnavailable';
import loadTranslations from './loadTranslations';
const log = require('./log/clog');
const common = require('../common.js');

export default function translateSlideRevision(context, payload, done) {
    context.dispatch('START_TRANSLATION', 'success');
    log.info(context);
    //enrich with user id
    let user = context.getStore(UserProfileStore).userid;
    //if (!user) user = '3'; //NEED TO REMOVE THE LINE

    payload.user = user.toString();
    payload.jwt = context.getStore(UserProfileStore).jwt;
        //enrich with root deck id if deck to be revised is not uppermost deck
    //    let parent = TreeUtil.getParentId(payload.selector);
    //    payload.root_deck = parent;
    context.service.create('slide.translate', payload, null, {timeout: 30 * 1000}, (err, res) => {
        if (err) {
            //context.dispatch('UPDATE_DECKEDIT_VIEW_STATE', 'error');
            //context.dispatch('SAVE_DECK_REVISION_FAILURE', err);
            log.error(context, {filepath: __filename, err: err});
            // context.executeAction(serviceUnavailable, payload, done);
            done();
        } else {
            //console.log('res:' + res.id);

            // let activity = {
            //     activity_type: 'edit',
            //     user_id: String(context.getStore(UserProfileStore).userid),
            //     content_id: String(newSid),
            //     content_kind: 'deck'
            // };
            // context.executeAction(addActivity, {activity: activity});

            context.dispatch('END_TRANSLATION', 'success');
            context.dispatch('LOAD_SLIDE_PREVIEW_SUCCESS', res);

            context.executeAction(loadTranslations, {
                params: payload.selector
            }, done);

        }
    });
}
