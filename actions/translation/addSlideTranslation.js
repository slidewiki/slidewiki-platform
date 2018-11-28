const log = require('../log/clog');
import {navigateAction} from 'fluxible-router';
import UserProfileStore from '../../stores/UserProfileStore';
import serviceUnavailable from '../error/serviceUnavailable';
import Util from '../../components/common/Util';
import DeckTreeStore from '../../stores/DeckTreeStore';
import { isEmpty } from '../../common.js';
import addActivity from '../activityfeed/addActivity';

export default function addSlideTranslation(context, payload, done) {
    log.info(context);
    
    payload.jwt = context.getStore(UserProfileStore).getState().jwt;

    // console.log('action addSlideTranslation selector', payload.selector);

    context.service.create('decktree.nodetranslation', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message });
            context.executeAction(serviceUnavailable, payload, done);//TODO improve
        } else {
            // console.log('addSlideTranslation service returned', res);
            
            //create new 'translate' activity
            let activity = {
                activity_type: 'translate',
                user_id: String(context.getStore(UserProfileStore).userid),
                content_id: res.node.id + '-' + res.node.revision,
                content_kind: 'slide',
                translation_info: {
                    language: payload.language
                },
            };
            const contentRootId = payload.selector.id;
            if (!isEmpty(contentRootId)) {
                activity.content_root_id = contentRootId;
            }
            context.executeAction(addActivity, {activity: activity});

            // update selector
            let newSlideId = res.node.id + '-' + res.node.revision;
            let newPath = location.pathname.toString().replace(new RegExp(payload.selector.sid, 'g'), newSlideId);
            // replace 'view', if exists, with 'edit'
            newPath = newPath.replace(/\/(view)?$/, '');

            if (payload.markdown) {
                newPath = newPath + '/markdownEdit';
            } else {
                newPath = newPath + '/edit';
            }
            

            let params = new URLSearchParams(location.search);
            params.set('language', payload.language);

            context.executeAction(navigateAction, { url: newPath + '?' + params.toString() }, done);
        }
    });
}
