import TagsStore from '../../stores/TagsStore';
import updateTagsSlide from './updateTagsSlide';
import updateTagsDeck from './updateTagsDeck';
const log = require('../log/clog');

export default function newTag(context, payload, done) {
    log.info(context);
    let { selector } = payload;
    let { tags } = context.getStore(TagsStore).getState();//TODO get tags after full dispacthing

    context.dispatch('NEW_TAG', payload);

    // //prepare the tags
    // let tagsObjectArray = tags.reduce((array, tag) => {
    //     array.push({tagName: tag});
    //     return array;
    // }, []);

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
