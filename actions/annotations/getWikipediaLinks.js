/**
 * Created by korovin on 3/14/2017.
 */
export default function getWikipediaLinks(context, payload, done) {
    context.service.read('annotations.wikipedia', payload, {timeout: 20 * 1000}, (err, res) => {
        context.dispatch('GET_WIKIPEDIA_LINKS', res);
        done();
    });
}
