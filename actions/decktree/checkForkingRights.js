import DeckEditStore from '../../stores/DeckEditStore';
import DeckViewStore from '../../stores/DeckViewStore';
import ContentStore from '../../stores/ContentStore';
import UserProfileStore from '../../stores/UserProfileStore';

export default function checkForkingRights(context, payload, done) {
    let isForkingPossible = payload;

    let deck = {
        sid: context.getStore(DeckViewStore).deckData._id + '-' + context.getStore(DeckViewStore).deckData.active,
        jwt: context.getStore(UserProfileStore).jwt
    };

    if (context.getStore(ContentStore).mode === 'edit') {
        deck.sid = context.getStore(DeckEditStore).deckProps.sid;
    }

    if (deck.sid === 'undefined-undefined' || deck.sid === undefined)
        return done();

    context.service.read('deck.forkAllowed', deck, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            console.log('Error on request:', err);
            res = {
                forkAllowed: false
            };
        }
        if (isForkingPossible !== res.forkAllowed) {
            context.dispatch('FORKING_RIGHTS_CHANGED', res.forkAllowed);
        }

        done();
    });
}
