import {shortTitle} from '../configs/general';
export default function addDeckSaveDeck(context, payload, done) {
    //enrich data
    payload.user = 1; //TODO

    context.service.create('deck.create', payload, {timeout: 30 * 1000}, (err, res) => {
        console.log('Action addDeckSaveDeck: got', err, res);
        if (err) {
            context.dispatch('UPLOAD_FAILURE', err);
        } else {
            context.dispatch('UPLOAD_SUCCESS', res);
        }
        done();
    });
}
