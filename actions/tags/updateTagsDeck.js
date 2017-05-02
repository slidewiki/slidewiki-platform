import DeckViewStore from '../../stores/DeckViewStore';
import saveDeckEdit from '../../actions/saveDeckEdit';
const log = require('../log/clog');

/**
 * Created by akorovin on 26.02.2017.
 */
export default function updateTagsDeck(context, payload, done) {
    log.info(context);
    const deckStore = context.getStore(DeckViewStore).getState();

    let { selector, tags } = payload;
    const { id, sid } = selector;
    let { license, description, revisions } = deckStore.deckData;
    let { title, theme, language } = revisions[revisions.length - 1];

    context.executeAction(saveDeckEdit, {
        deckId: sid? sid : id,
        title: title,
        language: language,
        description: description,
        // TODO: get from Presentation Store when it is implemented
        theme: theme,
        license: license,
        tags: tags,
        selector: selector
    });

    done();
}
