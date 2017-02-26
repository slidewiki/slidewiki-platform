import TagsStore from '../../stores/TagsStore';
import DataSourceStore from '../../stores/DataSourceStore';
import saveSlide from '../../actions/slide/saveSlide';
import SlideViewStore from '../../stores/SlideViewStore';
import DeckViewStore from '../../stores/DeckViewStore';

export default function addReply(context, payload, done) {
    console.log(payload.tag);
    let { selector } = payload;
    // const serviceAddr = 'tags.' + stype;
    context.dispatch('NEW_TAG', payload);
    let { tags } = context.getStore(TagsStore).getState();
    if (selector.stype === 'slide') {
        onSlideExecute(selector, tags, context);
    } else {
        onDeckExecute(selector, tags, context);
    }
    done();
}

function onSlideExecute(selector, tags, context) {
    const dataStore = context.getStore(DataSourceStore).getState();
    const slideStore = context.getStore(SlideViewStore).getState();

    const { id, sid } = selector;
    let { dataSources } = dataStore;
    dataSources = dataSources? dataSources: [];

    let { title, content, speakernotes } = slideStore;

    context.executeAction(saveSlide,
        {id: sid, deckID: id, title: title, content: content,
            speakernotes: speakernotes, dataSources: dataSources,
            selector: selector, tags: tags});
}

function onDeckExecute(selector, tags) {
    const deckStore = context.getStore(DeckViewStore).getState();
    console.log('dec execute');
}
