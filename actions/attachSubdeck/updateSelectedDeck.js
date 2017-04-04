export default function updateSelectedDeck(context,payload,done){
  
    context.dispatch('ATTACHSUBDECK_SELECTED_DECK', payload);

    done();
}
