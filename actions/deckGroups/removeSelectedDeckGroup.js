const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

export default function removeSelectedDeckGroup(context, payload, done) {
    log.info(context);
    context.dispatch('REMOVE_SELECTED_DECK_GROUP', payload);
    done();
}
