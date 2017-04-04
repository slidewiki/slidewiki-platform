export default function updateSelectedDeck(context,payload,done){
    console.log(payload);
    context.dispatch('ATTACHSUBDECK_SELECTED_DECK', payload);

    done();
}
