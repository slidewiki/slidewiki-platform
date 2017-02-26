import DeckViewStore from '../../stores/DeckViewStore';

/**
 * Created by akorovin on 26.02.2017.
 */
export default function onDeckExecute(selector, tags) {
    const deckStore = context.getStore(DeckViewStore).getState();
    console.log('dec execute');
}
