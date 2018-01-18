
const log = require('../log/clog');
import serviceUnavailable from '../error/serviceUnavailable';

export default function updateTranslationProgressBar(context, payload, done) {
    log.info(context);
    let totalSlides = payload.totalSlides;
    // console.log(payload);
    // //let percent = payload.percent; //TODO percent = res.percent
    //
    // setTimeout (() => {
    //     context.dispatch('UPDATE_TRANSLATION_PROGRESS_BAR', payload);
    //     if (payload.percent < 100){
    //         payload.percent++;
    //         updateTranslationProgressBar(context, payload, done);
    //     }else{
    //         done();
    //     }
    // },1000);
    //payload.id = '11355';

    context.service.read('deck.translationProgress', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            log.error(context, {filepath: __filename});
            context.executeAction(serviceUnavailable, payload, done);
            // context.dispatch('LOAD_SLIDE_ALL_FAILURE', err);
        } else {
            res.totalSlides = totalSlides;
            context.dispatch('UPDATE_TRANSLATION_PROGRESS_BAR', res);
            if (!res.noofslides || res.noofslides < totalSlides) {
                setTimeout(() => {
                    updateTranslationProgressBar(context, payload, done);
                    done();
                },1000);

            }else{
                done();
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
