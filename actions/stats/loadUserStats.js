import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import loadUserStatsByTime from './loadUserStatsByTime';
import loadUserStatsByTag from './loadUserStatsByTag';
import loadUserEngagement from './loadUserEngagement';



export default function loadUserStats(context, payload, done) {
    log.info(context);
    async.parallel([
        (callback) => {
            context.executeAction(loadUserStatsByTime, payload, callback);
        },
        (callback) => {
            context.executeAction(loadUserStatsByTag, payload, callback);
        },
        (callback) => {
            context.executeAction(loadUserEngagement, payload, callback);
        },
    ], (err, results) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            return;
        }
        done();
    });
}
