import DeckEditStore from '../../stores/DeckEditStore';
import DeckViewStore from '../../stores/DeckViewStore';
import ContentStore from '../../stores/ContentStore';

export default function checkForkingRights(context, payload, done) {
    let isForkingPossible = payload;

    let isPrivateOrRestricted = (accessLevel) => accessLevel === 'restricted' || accessLevel === 'private';

    if (context.getStore(ContentStore).mode === 'view') {
        // console.log('Check view stores deck data:', context.getStore(DeckViewStore).deckData);
        let deck = context.getStore(DeckViewStore).deckData;
        if (deck === undefined || deck.revisions === undefined)
            deck = {
                revisions:[],
                active: 0
            };
        let revision = deck.revisions.filter((revision) => {
            return revision.id === deck.active;
        })[0] || {accessLevel: ''};
        isForkingPossible = !isPrivateOrRestricted(revision.accessLevel);
    }
    else {
        isForkingPossible = !isPrivateOrRestricted(context.getStore(DeckEditStore).deckProps.accessLevel);
    }

    if (isForkingPossible !== payload) {
        context.dispatch('FORKING_RIGHTS_CHANGED', isForkingPossible);
    }

    done();
}
