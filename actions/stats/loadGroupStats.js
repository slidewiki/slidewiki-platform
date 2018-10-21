import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import loadGroupStatsByTime from './loadGroupStatsByTime';


export default function loadGroupStats(context, payload, done) {
    log.info(context);
    async.parallel([
        (callback) => {
            context.executeAction(loadGroupStatsByTime, payload, callback);
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
