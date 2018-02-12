const log = require('../log/clog');
import DeckEditStore from '../../stores/DeckEditStore';

export default function requestEditRights(context, payload, done) {
    log.info(context);
    payload.jwt = context.getUser().jwt;
    payload.userid = context.getUser().userid;

    console.log('requestEditRights: deck data:', context.getStore(ContentStore).getState().deckProps);

    context.service.read('deck.requesteditrights', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('EDITRIGHTS_ERROR', err);
            done();
        }
        else {
            if (res.isNew) {
                payload.ownerid = context.getStore(ContentStore).getState().deckProps.ownerid;
                payload.deckname = context.getStore(ContentStore).getState().deckProps.deckname;

                context.service.update('user.sendEmail', payload, { timeout: 20 * 1000 }, (err2, res2) => {
                    if (err) {
                        // console.log(err, err.statusCode, err.message);
                        switch (err.statusCode) {
                            case 401:
                                context.dispatch('EDITRIGHTS_ERROR', err);
                                break;

                            case 404:
                                context.dispatch('EDITRIGHTS_ERROR', err);
                                break;
                        }
                    } else {
                        context.dispatch('EDITRIGHTS_SUCCESS');
                    }

                    done();
                });
            }
            else {
                context.dispatch('EDITRIGHTS_SUCCESS_ALREADY_REQUESTED');
                done();
            }
        }
    });
}
