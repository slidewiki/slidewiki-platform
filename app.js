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
import TagsStore from './stores/TagsStore';
import ActivityFeedStore from './stores/ActivityFeedStore';
import DeckTreeStore from './stores/DeckTreeStore';
import TranslationStore from './stores/TranslationStore';
import DeckHistoryStore from './stores/DeckHistoryStore';
import SlideHistoryStore from './stores/SlideHistoryStore';
import DiffViewStore from './stores/DiffViewStore';
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
import UserProfileStore from './stores/UserProfileStore';
import ErrorStore from './stores/ErrorStore';
import AddDeckStore from './stores/AddDeckStore';
import ResetPasswordStore from './stores/ResetPasswordStore';
import SendReportStore from './stores/SendReportStore';
import DeckListStore from './stores/DeckListStore';
import ContentActionsFooterStore from './stores/ContentActionsFooterStore';
import IntlStore from './stores/IntlStore';
import AttachSubdeckModalStore from './stores/AttachSubdeckModalStore';
import AttachQuestionsModalStore from './stores/AttachQuestionsModalStore';
import ServiceErrorStore from './stores/ServiceErrorStore';
import PermissionsStore from './stores/PermissionsStore';
import ContentLikeStore from './stores/ContentLikeStore';
import DeckFamilyStore from './stores/DeckFamilyStore';
import MediaStore from './stores/MediaStore';
import PaintModalStore from './stores/PaintModalStore';
import UserReviewStore from './stores/UserReviewStore';
import EditRightsStore from './stores/EditRightsStore';
import DeckCollectionStore from './stores/DeckCollectionStore';
import SSOStore from './stores/SSOStore';
import UserPerformancePredictionsStore from './stores/UserPerformancePredictionsStore';
import UserRecommendationsStore from './stores/UserRecommendationsStore';
import UserFollowingsStore from './stores/UserFollowingsStore';
import LoginModalStore from './stores/LoginModalStore';
import UserStatsStore from './stores/UserStatsStore';
import UserGroupsStore from './stores/UserGroupsStore';
import GroupStatsStore from './stores/GroupStatsStore';
import DeckStatsStore from './stores/DeckStatsStore';
import SlideCurrentlyEditedStore from './stores/SlideCurrentlyEditedStore';


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
        TagsStore,
        ActivityFeedStore,
        DeckTreeStore,
        TranslationStore,
        DeckHistoryStore,
        SlideHistoryStore,
        DiffViewStore,
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
        UserProfileStore,
        ErrorStore,
        AddDeckStore,
        ResetPasswordStore,
        SendReportStore,
        DeckListStore,
        ContentActionsFooterStore,
        IntlStore,
        AttachSubdeckModalStore,
        AttachQuestionsModalStore,
        ServiceErrorStore,
        PermissionsStore,
        ContentLikeStore,
        DeckFamilyStore,
        UserReviewStore,
        MediaStore,
        PaintModalStore,
        EditRightsStore,
        DeckCollectionStore,
        SSOStore,
        UserPerformancePredictionsStore,
        UserRecommendationsStore,
        UserFollowingsStore,
        LoginModalStore,
        UserStatsStore,
        UserGroupsStore,
        GroupStatsStore,
        DeckStatsStore,
        SlideCurrentlyEditedStore
    ]
});

// register plugins
app.plug(fetchrPlugin({
    xhrPath: '/api' // Path for XHR to be served from
}));
app.plug(userStoragePlugin({}));

module.exports = app;
