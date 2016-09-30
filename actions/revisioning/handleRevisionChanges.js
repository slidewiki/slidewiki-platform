import {shortTitle} from '../../configs/general';

export default function handleRevisionChanges(context, payload, done) {
    context.service.read('deck.handleRevisionChanges', payload, {}, (err, res) => {
        if (err) {
            context.dispatch('ERROR_UPDATE_REVISIONING_RESULT', err);
        } else {
            context.dispatch('UPDATE_REVISIONING_RESULT', res);
        }
        done();
    });
}
