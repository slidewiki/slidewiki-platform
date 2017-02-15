import DeckEditStore from '../../stores/DeckEditStore';
import DeckViewStore from '../../stores/DeckViewStore';
import ContentStore from '../../stores/ContentStore';

export default function checkForkingRights(context, payload, done) {
    let isForkingPossible = payload;

    if (context.getStore(ContentStore).mode === 'view') {
        // console.log('Check view stores deck data:', context.getStore(DeckViewStore).deckData);
        let deck = context.getStore(DeckViewStore).deckData;
        let revision = deck.revisions.filter((revision) => {
            return revision.id === deck.active;
        })[0];
        isForkingPossible = revision.accessLevel === 'public';
    }
    else {
        isForkingPossible = context.getStore(DeckEditStore).deckProps.accessLevel === 'public';
    }

    if (isForkingPossible !== payload) {
        context.dispatch('FORKING_RIGHTS_CHANGED', isForkingPossible);
    }

    done();
}
