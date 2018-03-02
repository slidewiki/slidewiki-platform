/**
 * Created by korovin on 3/11/2017.
 */
export default function removeTempSelection(context, payload, done) {
    context.dispatch('REMOVE_RANGE_SELECTION', []);
    done();
}
