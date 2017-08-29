import log from '../log/clog';

export default function saveSecret(context,payload,done){
    log.info(context);
    context.dispatch('SAVE_SECRET', payload);

    done();
}
