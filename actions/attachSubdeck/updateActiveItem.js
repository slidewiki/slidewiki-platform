import log from '../log/clog';

export default function updateActiveItem(context,payload,done){
    log.info(context);
    context.dispatch('ATTACHSUBDECK_ACTIVE_ITEM', payload);

    done();
}
