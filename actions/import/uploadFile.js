'use strict';
import { shortTitle } from '../../configs/general';

export default function uploadFile(context, payload, done) {
    context.dispatch('UPLOAD_STARTED', null);

    //use timer in order to make a working progress bar
    context.myStuff = {
        uploadFinished: false
    };
    const timeout = 60;
    const remainingProgress = 89;
    const updatePeriod = 3; //3 seconds
    const progressPerThreeSeconds = (timeout / remainingProgress) * updatePeriod + 1;
    const timer = () => {
        setTimeout(() => {
            if (!context.myStuff.uploadFinished) {
                context.dispatch('UPLOAD_MORE_PROGRESS', progressPerThreeSeconds);
                timer();
            }
        }, updatePeriod * 1000);
    };
    timer();

    context.service.create('import', payload, {timeout: timeout * 1000}, {timeout: timeout * 1000}, (err, res) => {
        console.log('action got response from server', err);

        context.myStuff.uploadFinished = true;
        if (err) {
            context.dispatch('UPLOAD_FAILED', err);
            context.dispatch('CREATION_FAILURE', err);
        } else {
            //TODO: use correct headers - atm service is not ready
            if (res.deckid === undefined) {
              res.deckid = 165;
            }

            context.dispatch('UPLOAD_SUCCESS', res);
        }
        done();
    });
}
