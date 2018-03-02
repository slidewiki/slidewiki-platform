/**
 * Created by korovin on 3/16/2017.
 */
export default function removeUriSuggestions(context, payload, done) {
    context.dispatch('REMOVE_URI_SUGGESTIONS');
    done();
}
