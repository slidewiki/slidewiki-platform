import log from '../log/clog';

export default function updateShowOptions(context,payload,done){
    log.info(context);
    context.dispatch('ATTACHQUESTIONS_SHOW_OPTIONS', payload);

    done();
}
