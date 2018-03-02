/**
 * Created by korovin on 3/16/2017.
 */
export default function getURISuggestions(context, payload, done) {
    context.service.read('annotations.uri', payload, {timeout: 20 * 1000}, (err, res) => {
        context.dispatch('GET_URI_SUGGESTIONS', res);
        done();
    });
}
