const log = require('../log/clog');

export default function requestEditRights(context, payload, done) {
    log.info(context);
    payload.jwt = context.getUser().jwt;
    payload.userid = context.getUser().userid;

    context.service.read('deck.requesteditrights', payload, { timeout: 20 * 1000 }, (err, res) => {
        if (err) {
            context.dispatch('EDITRIGHTS_ERROR', err);
            done();
        }
        else {
            if (res.ownerid) {
                payload.ownerid = res.ownerid;
                payload.deckname = res.deckname;

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
