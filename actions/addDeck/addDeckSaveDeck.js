import {shortTitle} from '../../configs/general';
export default function addDeckSaveDeck(context, payload, done) {
    //enrich data
    if (payload.userid === undefined || payload.userid === null || payload.userid === '')
        payload.userid = 1; //TODO remove

    context.service.create('deck.create', payload, {timeout: 30 * 1000}, (err, res) => {
        console.log('Action addDeckSaveDeck: got', err, res);
        if (err) {
            context.dispatch('CREATION_FAILURE', err);
        } else {
            context.dispatch('CREATION_SUCCESS', res);
        }
        done();
    });
}
