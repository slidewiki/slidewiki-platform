
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';
import loadTranslations from './loadTranslations';
import resetTranslationStore from './resetTranslationStore';

export default function updateTranslationProgressBar(context, payload, done) {
    log.info(context);

    context.service.read('deck.translationProgress', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            // context.dispatch('LOAD_SLIDE_ALL_FAILURE', err);
        } else {
            context.dispatch('UPDATE_TRANSLATION_PROGRESS_BAR', res);
            if (!res.noofslides || res.noofslides < res.totalslides) {
                setTimeout(() => {
                    updateTranslationProgressBar(context, payload, done);
                },1000);

            }else if (res.noofslides === res.totalslides){ //translation is completed, here goes notifications and update of languages available
                context.executeAction(loadTranslations, {
                    params: {'id':payload.oldId}
                }, done);
            }else{
                done();//
            }
            //context.dispatch('SLIDES_PROGRESS', res);
        }
    });


    // context.service.read('deck.properties', payload, {timeout: 20 * 1000}, (err, res) => {
    //     if (err) {
    //         log.error(context, {filepath: __filename});
    //         // context.executeAction(serviceUnavailable, payload, done);
    //         //context.dispatch('LOAD_DECK_PROPS_FAILURE', err);
    //         done();
    //         return;
    //     }
    //
    //
    //
    //
    //     done();
    // });
}
