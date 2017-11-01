const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import UserProfileStore from '../../stores/UserProfileStore';

export default function addSelectedDeckGroup(context, payload, done) {
    log.info(context);
    context.dispatch('ADD_SELECTED_DECK_GROUP', payload);
    done();
}
