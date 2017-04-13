import updateTagsSlide from './updateTagsSlide';
import updateTagsDeck from './updateTagsDeck';
const log = require('../log/clog');

export default function saveTags(context, payload, done) {
    log.info(context);
    let { selector, tags } = payload;

    if (selector.stype === 'slide') {
        context.executeAction(updateTagsSlide, {
            tags: tags,
            selector: selector
        });
    } else {
        context.executeAction(updateTagsDeck, {
            tags: tags,
            selector: selector
        });
    }
    done();
}
