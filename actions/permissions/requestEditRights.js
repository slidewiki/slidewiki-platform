const log = require('../log/clog');
import DeckEditStore from '../../stores/DeckEditStore';
import DeckViewStore from '../../stores/DeckViewStore';

export default function requestEditRights(context, payload, done) {
    log.info(context);
    payload.jwt = context.getUser().jwt;
    payload.userid = context.getUser().userid;

    // console.log('requestEditRights: deck data:', context.getStore(DeckViewStore).getState().deckData, context.getStore(DeckViewStore).getState().ownerData, context.getStore(DeckViewStore).getState().originCreatorData);

    context.service.read('deck.requesteditrights', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            if (err.statusCode === 422) {
                context.dispatch('EDITRIGHTS_SUCCESS_ALREADY_REQUESTED');
                return done();
            }

            context.dispatch('EDITRIGHTS_ERROR', err);
            done();
        }
        else {
            if (res.isNew) {
                let deckData = context.getStore(DeckViewStore).getState().deckData;
                payload.ownerid = deckData.user;
                payload.deckname = deckData.title;

                // console.log('again the payload:', payload);

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
