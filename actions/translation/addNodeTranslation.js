import log from '../log/clog';
import DeckTreeStore from '../../stores/DeckTreeStore';
import addDeckTranslation from './addDeckTranslation';
import addSlideTranslation from './addSlideTranslation';

export default function addNodeTranslation(context, payload, done) {
    log.info(context);

    let currentSelector = context.getStore(DeckTreeStore).getState().selector.toJS();
    if (currentSelector.stype === 'slide') {
        context.executeAction(addSlideTranslation, {
            selector: currentSelector,
            language: payload.language,
        }, done);
    } else {
        context.executeAction(addDeckTranslation, {
            selector: currentSelector,
            language: payload.language,
        }, done);
    }
}
