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
    const timeout = 120;
    const remainingProgress = 55;
    let currentProgress = 0;
    const averageUploadSpeed = 0.5; // MB/s
    const updatePeriod = 2; // 2 seconds
    const MBPerUpdatePeriod = updatePeriod * averageUploadSpeed;
    const noOfUpdatePeriods = payload.base64.length / MBPerUpdatePeriod / 1024 / 1024;
    let progressPerUpdatePeriod = parseInt(remainingProgress / noOfUpdatePeriods) + 1;
    const timer = () => {
        setTimeout(() => {
            if (!context.myStuff.uploadFinished && currentProgress < remainingProgress) {
                currentProgress += progressPerUpdatePeriod;
                if (currentProgress > remainingProgress) {
                    progressPerUpdatePeriod -= currentProgress - remainingProgress;
                }
                context.dispatch('UPLOAD_MORE_PROGRESS', progressPerUpdatePeriod);
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
