const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function loadForks(context, payload, done) {
    log.info(context);
    let {selector, user} = payload;
    context.service.read('deck.forks', {params: {id: selector.id, user: user}}, {}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('LOAD_FORKS_SUCCESS', {ownedForks: res});
            done();
        }
    });
}
