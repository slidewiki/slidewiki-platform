import log from '../log/clog';

import hideTransferOwnershipModal from './hideTransferOwnershipModal';

import UserProfileStore from '../../stores/UserProfileStore';

export default function deckDeletion(context, payload, done) {
    log.info(context);

    context.executeAction(hideTransferOwnershipModal, {} , () => {
        context.dispatch('START_DELETE_DECK');

        payload.jwt = context.getStore(UserProfileStore).jwt;

        context.service.delete('deck.delete', payload, { timeout: 20 * 1000 }, (err, res) => {
            if (err) {
                context.dispatch('DELETE_DECK_ERROR', err);
            }
            else {
                context.dispatch('DELETE_DECK_SUCCESS', res);
            }
            done();
        });
    });
}
