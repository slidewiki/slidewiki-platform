import Fluxible from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';
import userStoragePlugin from './plugins/UserStorage/userStoragePlugin';
import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';
import RouteStore from './stores/RouteStore';
import ContributorsStore from './stores/ContributorsStore';
import DeckPageStore from './stores/DeckPageStore';
import ContentStore from './stores/ContentStore';
import DeckViewStore from './stores/DeckViewStore';
import DeckEditStore from './stores/DeckEditStore';
import SlideViewStore from './stores/SlideViewStore';
import SlideEditStore from './stores/SlideEditStore';
import DataSourceStore from './stores/DataSourceStore';
import ActivityFeedStore from './stores/ActivityFeedStore';
import DeckTreeStore from './stores/DeckTreeStore';
import TranslationStore from './stores/TranslationStore';
import ContentHistoryStore from './stores/ContentHistoryStore';
import ContentUsageStore from './stores/ContentUsageStore';
import ContentQuestionsStore from './stores/ContentQuestionsStore';
import ContentDiscussionStore from './stores/ContentDiscussionStore';
import SimilarContentStore from './stores/SimilarContentStore';
import ContentModulesStore from './stores/ContentModulesStore';
import ImportStore from './stores/ImportStore';
import PresentationStore from './stores/PresentationStore';
import UserNotificationsStore from './stores/UserNotificationsStore';
import UserRegistrationStore from './stores/UserRegistrationStore';
import SearchResultsStore from './stores/SearchResultsStore';
import AdvancedSearchStore from './stores/AdvancedSearchStore';
import UserProfileStore from './stores/UserProfileStore';
import ErrorStore from './stores/ErrorStore';
import AddDeckStore from './stores/AddDeckStore';

// create new fluxible instance & register all stores
const app = new Fluxible({
    component: Application,
    stores: [
        RouteStore,
        ApplicationStore,
        DeckPageStore,
        ContentStore,
        ContributorsStore,
        DeckViewStore,
        DeckEditStore,
        SlideViewStore,
        SlideEditStore,
        DataSourceStore,
        ActivityFeedStore,
        DeckTreeStore,
        TranslationStore,
        ContentHistoryStore,
        ContentUsageStore,
        ContentQuestionsStore,
        ContentDiscussionStore,
        SimilarContentStore,
        ContentModulesStore,
        ImportStore,
        PresentationStore,
        UserNotificationsStore,
        UserRegistrationStore,
        SearchResultsStore,
        AdvancedSearchStore,
        UserProfileStore,
        ErrorStore,
        AddDeckStore
    ]
});

// register plugins
app.plug(fetchrPlugin({
    xhrPath: '/api' // Path for XHR to be served from
}));
app.plug(userStoragePlugin({}));

module.exports = app;
