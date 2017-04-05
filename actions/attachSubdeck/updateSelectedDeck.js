import log from '../log/clog';

export default function updateSelectedDeck(context,payload,done){
    log.info(context);
    context.dispatch('ATTACHSUBDECK_SELECTED_DECK', payload);

    done();
}
