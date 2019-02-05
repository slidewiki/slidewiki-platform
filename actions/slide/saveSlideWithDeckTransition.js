const log = require('../log/clog');
import saveSlide from './saveSlide';

export default function saveSlideWithDeckTransition(context, payload, done) {
    let args = {
        id: payload.currentSlidePayload.deckID
    };
    context.service.read('deck.slides', args, {timeout: 20 * 1000}, (err, res) => {
        res.slides.map((slide) => {
            if(slide.id === payload.currentSlidePayload.id) {
                context.executeAction(saveSlide, payload.currentSlidePayload);
            } else {
                let otherPayload = {
                    id: slide.id,

                    transition: payload.currentSlidePayload.transition
                };
                // Extract necessary information from each slide, add transition and update it in deck-service.

            }
        });
    });



}
