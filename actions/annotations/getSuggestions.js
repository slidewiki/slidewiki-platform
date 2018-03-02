import TagWrapper from "./utils/TagWrapper";
import AnnotationStore from '../../stores/AnnotationStore';

/**
 * Created by korovin on 3/12/2017.
 */
export default function getSuggestions(context, payload, done) {
    context.service.read('annotations.suggestions', payload, {timeout: 20 * 1000}, (err, res) => {
        context.dispatch('GET_SUGGESTIONS', res);
        let { suggestions } = context.getStore(AnnotationStore).getState();

        if (!suggestions.length) return;

        let annotations = TagWrapper.wrapSuggestions(suggestions);

        context.service.read('annotations.wikipedia', {suggestions: suggestions}, {timeout: 20 * 1000}, (err, res) => {
            console.log(res);
            context.dispatch('SAVE_ANNOTATIONS', {
                annotations: annotations,
                links: res
            });
            done();
        });
    });
}
