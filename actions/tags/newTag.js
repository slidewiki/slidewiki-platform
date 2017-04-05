import TagsStore from '../../stores/TagsStore';
import updateTagsSlide from './updateTagsSlide';
import updateTagsDeck from './updateTagsDeck';

export default function addReply(context, payload, done) {
    let { selector } = payload;
    let { tags } = context.getStore(TagsStore).getState();

    context.dispatch('NEW_TAG', payload);

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
