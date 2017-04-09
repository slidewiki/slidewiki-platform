import log from '../log/clog';

export default function resetModalStore(context,payload,done){
    log.info(context);
    context.dispatch('ATTACHSUBDECK_RESET', payload);

    done();
}
