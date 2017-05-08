'use strict';
import { shortTitle } from '../../configs/general';
import serviceUnavailable from '../error/serviceUnavailable';
const log = require('../log/clog');

export default function uploadFile(context, payload, done) {
    log.info(context);
    context.dispatch('UPLOAD_STARTED', null);

    // use timer in order to make a working progress bar
    context.myStuff = {
        uploadFinished: false
    };
    const timeout = 60;
    const remainingProgress = 55;
    let currentProgress = 0;
    const updatePeriod = payload.base64.length / 30 / 1000 / 1024 ; // progress bar speed depends on file length
    const progressStep = 1;
    const timer = () => {
        setTimeout(() => {
            if (!context.myStuff.uploadFinished && currentProgress < remainingProgress) {
                currentProgress += progressStep;
                context.dispatch('UPLOAD_MORE_PROGRESS', progressStep);
                timer();
            }
        }, updatePeriod * 1000);
    };
    timer();

    context.service.create('import', payload, {timeout: timeout * 1000}, {timeout: timeout * 1000}, (err, res) => {
        //console.log('action got response from server', err);

        context.myStuff.uploadFinished = true;
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
            //context.dispatch('UPLOAD_FAILED', err);
            //context.dispatch('CREATION_FAILURE', err);
        } else {
            //TODO: use correct headers - atm service is not ready
            if (res.deckid === undefined) {
                context.dispatch('UPLOAD_FAILED', err);
                context.dispatch('CREATION_FAILURE', err);
            }

            context.dispatch('UPLOAD_SUCCESS', res);
        }
        done();
    });
}
