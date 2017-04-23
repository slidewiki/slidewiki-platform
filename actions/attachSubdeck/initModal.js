import log from '../log/clog';

export default function initModal(context,payload,done){
    log.info(context);
    context.dispatch('ATTACHSUBDECK_INIT', payload);

    done();
}
