import async from 'async';
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import loadDeckUserStats from './loadDeckUserStats';
import loadDeckStatsByTime from './loadDeckStatsByTime';


export default function loadDeckStats(context, payload, done) {

    log.info(context);
    async.parallel([
        (callback) => {
            context.executeAction(loadDeckStatsByTime, payload, callback);
        },
        (callback) => {
            console.log('loading user deck stats');

            context.executeAction(loadDeckUserStats, payload, callback);
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
