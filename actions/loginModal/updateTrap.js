import log from '../log/clog';

export default function updateActiveItem(context,payload,done){
    log.info(context);
    context.dispatch('LOGIN_UPDATE_TRAP', payload);

    done();
}
