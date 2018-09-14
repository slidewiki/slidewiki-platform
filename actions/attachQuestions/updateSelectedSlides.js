import log from '../log/clog';
/*nikki no longer needed? */
export default function updateSelectedSlides(context,payload,done){
    log.info(context);
    context.dispatch('ATTACHQUESTIONS_SELECTED_SLIDES', payload);

    done();
}
