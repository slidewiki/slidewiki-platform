import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import notFoundError from '../error/notFoundError';
import loadCollectionDetails from './loadCollectionDetails';
import fetchUser from '../../actions/user/userprofile/fetchUser';
import getFollowing from '../../actions/following/getFollowing';
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
        },
        (callback) => {
            const userId = context.getStore(UserProfileStore).getState().userid;
            if (userId !== undefined && userId !== null && userId !== '') {
                context.executeAction(getFollowing, {playlistId: payload.params.id, userId: userId, followed_type: 'playlist'}, callback);
            } else {
                callback();
            }
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
