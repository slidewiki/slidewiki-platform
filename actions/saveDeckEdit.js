import UserProfileStore from '../stores/UserProfileStore';

export default function saveDeckEdit(context, payload, done) {
    //enrich with user id
    payload.userid = context.getStore(UserProfileStore).userid;

    context.service.update('deck.update', payload, null, {timeout: 30 * 1000}, (err, res) => {
        if (err) {
            context.dispatch('SAVE_DECK_EDIT_FAILURE', err);
        } else {
            context.dispatch('SAVE_DECK_EDIT_SUCCESS', res);
        }
        done();
    });
}