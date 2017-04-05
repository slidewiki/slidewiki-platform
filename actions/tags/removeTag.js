import TagsStore from '../../stores/TagsStore';
import updateTagsSlide from './updateTagsSlide';
import updateTagsDeck from './updateTagsDeck';

export default function removeTag(context, payload, done) {
    let { selector } = payload;
    context.dispatch('REMOVE_TAG', payload);
    let { tags } = context.getStore(TagsStore).getState();

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
