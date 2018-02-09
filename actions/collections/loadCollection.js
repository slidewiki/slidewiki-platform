import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import notFoundError from '../error/notFoundError';
import loadCollectionDetails from './loadCollectionDetails';
import fetchUser from '../../actions/user/userprofile/fetchUser';
import UserProfileStore from '../../stores/UserProfileStore';

// loads deck collection details and user info
export default function loadCollection(context, payload, done) {
    log.info(context);

    // load required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(fetchUser, {
                params: {
                    username: context.getStore(UserProfileStore).getState().username
                }
            }, callback);
        },
        (callback) => {
            context.executeAction(loadCollectionDetails, payload, callback);
        }
    ], (err, results) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        }

        done();
    });
    
}
