import log from '../log/clog';

export default function updateShowWarning(context,payload,done){
    log.info(context);
    context.dispatch('ATTACHQUESTIONS_SHOW_WARNING', payload);

    done();
}
