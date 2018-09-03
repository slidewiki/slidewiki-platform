import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import notFoundError from '../error/notFoundError';
import loadDeckCollections from './loadDeckCollections';
import loadUserCollections from './loadUserCollections';
import UserProfileStore from '../../stores/UserProfileStore';

// loads collection for a deck and the user collection options
export default function loadCollectionsTab(context, payload, done) {
    log.info(context);

    // load required actions in parallel
    async.parallel([
        (callback) => {
            context.executeAction(loadDeckCollections, payload, callback);
        },
        (callback) => {
            // if logged in, then request collections that the user has edit rights
            if (context.getStore(UserProfileStore).userid) {
                context.executeAction(loadUserCollections, payload, callback);
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
