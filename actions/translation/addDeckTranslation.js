const log = require('../log/clog');
import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';
import Util from '../../components/common/Util';
import {navigateAction} from 'fluxible-router';
import { isEmpty } from '../../common.js';
import addActivity from '../activityfeed/addActivity';

export default function addDeckTranslation(context, payload, done) {
    log.info(context);

    let actualPayload = {
        jwt: context.getStore(UserProfileStore).getState().jwt,
        // either just for the subdeck, or for the root deck 
        id: payload.selector.sid || payload.selector.id,
        language: payload.language,
    };

    // console.log('action addDeckTranslation deck id', actualPayload.id);

    context.service.update('deck.translations', actualPayload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message});
            context.executeAction(serviceUnavailable, payload, done);//TODO improve
        } else {
            //create new 'translate' activity
            let activity = {
                activity_type: 'translate',
                user_id: String(context.getStore(UserProfileStore).userid),
                content_id: payload.selector.sid,
                content_kind: 'deck',
                translation_info: {
                    language: payload.language
                },
            };
            const contentRootId = payload.selector.id;
            if (!isEmpty(contentRootId)) {
                activity.content_root_id = contentRootId;
            }
            context.executeAction(addActivity, {activity: activity});
          
            let url = Util.makeNodeURL(payload.selector, 'deck', 'edit', undefined, payload.language);
            context.executeAction(navigateAction, { url }, done);
        }
    });
}
