import {shortTitle} from '../../configs/general';

export default function needsNewRevisionCheck(context, payload, done) {
    context.service.read('deck.needsNewRevision', payload, {}, (err, res) => {
        if (err) {
            context.dispatch('ERROR_UPDATE_REVISIONING_STATUS', err);
        } else {
            context.dispatch('UPDATE_REVISIONING_STATUS', res);
        }
        done();
    });
}
