import DeckViewStore from '../../stores/DeckViewStore';
import saveDeckEdit from '../../actions/saveDeckEdit';

/**
 * Created by akorovin on 26.02.2017.
 */
export default function onDeckExecute(context, payload, done) {
    const deckStore = context.getStore(DeckViewStore).getState();

    let { selector, tags } = payload;
    const { id, sid } = selector;
    let { license, description, revisions } = deckStore.deckData;
    let { title, language } = revisions[revisions.length - 1];

    context.executeAction(saveDeckEdit, {
        deckId: sid? sid : id,
        title: title,
        language: language,
        description: description,
        // TODO: get from Presentation Store when it is implemented
        theme: '',
        license: license,
        tags: tags,
        selector: selector
    });
}
