import log from '../log/clog';

export default function updateSelectedSlides(context,payload,done){
    log.info(context);
    context.dispatch('ATTACHSUBDECK_SELECTED_SLIDES', payload);

    done();
}
