import DeckViewStore from '../../stores/DeckViewStore';
import saveDeckEdit from '../../actions/saveDeckEdit';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';
/**
 * Created by akorovin on 26.02.2017.
 */
export default function updateTagsDeck(context, payload, done) {
    log.info(context);

    // get user id from UserProfileStore
    payload.userid = context.getStore(UserProfileStore).userid;
    payload.userid = -1;
    
    context.service.update('deck.updateTags', payload, null, {timeout: 30 * 1000}, (err, res) => {
        if(err){
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('UPDATE_TAGS_SUCCESS', res);
            context.dispatch('CHANGE_EDIT_MODE', res);
        }

        done();
    });
}
