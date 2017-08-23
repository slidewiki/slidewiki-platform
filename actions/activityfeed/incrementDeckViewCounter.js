import log from '../log/clog';

export default function incrementDeckViewCounter(context,payload,done){
    log.info(context);
    context.dispatch('INCREMENT_DECK_VIEW_COUNTER', payload);

    done();
}
