import log from '../log/clog';
import serviceUnavailable from '../error/serviceUnavailable';

// loads count of deck collections assigned to a deck
export default function loadPlaylistsCount(context, payload, done) {
    log.info(context);
    
    let args = (payload.params) ? payload.params : payload;
    args.countOnly = true;

    context.service.read('deckgroups.forDeck', args, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename, message: err.message});
            context.dispatch('LOAD_PLAYLISTS_COUNT_FAILURE', err);
        } else {
            context.dispatch('LOAD_PLAYLISTS_COUNT', res);
        }
        
        done();
    });

}
