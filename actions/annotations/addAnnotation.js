import Annotation from './classes/Annotation';
import TagWrapper from './utils/TagWrapper';

/**
 * Created by korovin on 3/11/2017.
 */
export default function addAnnotation(context, payload, done) {
    let { type, uri, name } = payload;
    context.dispatch('RESTORE_SELECTION');
    let annotation = new Annotation(uri, type, name);
    let serialized = TagWrapper.wrapAnnotation(annotation);

    context.dispatch('REMOVE_SELECTION');
    context.dispatch('SAVE_ANNOTATION', serialized);
    done();
}
