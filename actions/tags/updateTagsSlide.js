import DataSourceStore from '../../stores/DataSourceStore';
import saveSlide from '../../actions/slide/saveSlide';
import SlideViewStore from '../../stores/SlideViewStore';

/**
 * Created by akorovin on 26.02.2017.
 */
export default function onSlideExecute(context, payload, done) {
    let { selector, tags } = payload;

    const dataStore = context.getStore(DataSourceStore).getState();
    const slideStore = context.getStore(SlideViewStore).getState();

    const { id, sid } = selector;
    let { dataSources } = dataStore;
    dataSources = dataSources? dataSources: [];

    let { title, content, speakernotes } = slideStore;

    context.executeAction(saveSlide, {
        id: sid,
        deckID: id,
        title: title,
        content: content,
        speakernotes: speakernotes,
        dataSources: dataSources,
        selector: selector,
        tags: tags
    });
}
