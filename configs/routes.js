//general app config
import {shortTitle, fullTitle} from '../configs/general';
//list of actions
import loadContent from '../actions/loadContent';
import loadContributors from '../actions/loadContributors';
import loadDeck from '../actions/loadDeck';
import loadSlideView from '../actions/loadSlideView';
import loadSlideEdit from '../actions/loadSlideEdit';
import loadDeckView from '../actions/loadDeckView';
import loadDeckEdit from '../actions/loadDeckEdit';
import loadDataSources from '../actions/loadDataSources';
import loadActivities from '../actions/loadActivities';
import loadDeckTree from '../actions/loadDeckTree';
import loadTranslations from '../actions/loadTranslations';
import loadContentHistory from '../actions/loadContentHistory';
import loadContentUsage from '../actions/loadContentUsage';

export default {
    //-----------------------------------HomePage routes------------------------------
    home: {
        path: '/',
        method: 'get',
        page: 'home',
        title: 'SlideWiki -- Home',
        handler: require('../components/Home/Home'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: fullTitle
            });
            done();
        }
    },
    about: {
        path: '/about',
        method: 'get',
        page: 'about',
        title: 'SlideWiki -- About',
        handler: require('../components/Home/About'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | About'
            });
            done();
        }
    },
    //-----------------------------------DeckPage routes------------------------------
    // selector {stype: 'type of content e.g. slide, deck or question', sid: 'id of content type', sposition: 'if there are multiple item use the position', mode: 'interaction mode e.g. view or edit'}
    deck: {
        path: '/deck/:id/:stype?/:sid?/:sposition?/:mode?',
        method: 'get',
        page: 'deck',
        handler: require('../components/Deck/Deck'),
        action: (context, payload, done) => {
            context.executeAction(loadDeck, payload, done);
        }
    },
    contributors: {
        path: '/contributors/:stype/:sid',
        method: 'get',
        page: 'contributors',
        handler: require('../components/Deck/ContributorsPanel/ContributorsPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadContributors, payload, done);
        }
    },
    content: {
        path: '/content/:stype/:sid/:mode?',
        method: 'get',
        page: 'content',
        handler: require('../components/Deck/ContentPanel/ContentPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadContent, payload, done);
        }
    },
    slideview: {
        path: '/slideview/:sid',
        method: 'get',
        page: 'slideview',
        handler: require('../components/Deck/ContentPanel/SlideModes/SlideViewPanel/SlideViewPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadSlideView, payload, done);
        }
    },
    slideedit: {
        path: '/slideedit/:sid',
        method: 'get',
        page: 'slideedit',
        handler: require('../components/Deck/ContentPanel/SlideModes/SlideEditPanel/SlideEditPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadSlideEdit, payload, done);
        }
    },
    deckview: {
        path: '/deckview/:sid',
        method: 'get',
        page: 'deckview',
        handler: require('../components/Deck/ContentPanel/DeckModes/DeckViewPanel/DeckViewPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadDeckView, payload, done);
        }
    },
    deckedit: {
        path: '/deckedit/:sid',
        method: 'get',
        page: 'deckedit',
        handler: require('../components/Deck/ContentPanel/DeckModes/DeckEditPanel/DeckEditPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadDeckEdit, payload, done);
        }
    },
    datasource: {
        path: '/datasource/:stype/:sid',
        method: 'get',
        page: 'datasources',
        handler: require('../components/Deck/DataSourcePanel/DataSourcePanel'),
        action: (context, payload, done) => {
            context.executeAction(loadDataSources, payload, done);
        }
    },
    activities: {
        path: '/activities/:stype/:sid',
        method: 'get',
        page: 'activities',
        handler: require('../components/Deck/ActivityFeedPanel/ActivityFeedPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadActivities, payload, done);
        }
    },
    translations: {
        path: '/translations/:stype/:sid',
        method: 'get',
        page: 'translations',
        handler: require('../components/Deck/TranslationPanel/TranslationPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadTranslations, payload, done);
        }
    },
    history: {
        path: '/history/:stype/:sid',
        method: 'get',
        page: 'history',
        handler: require('../components/Deck/ContentPanel/ContentHistoryPanel/ContentHistoryPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadContentHistory, payload, done);
        }
    },
    usage: {
        path: '/usage/:stype/:sid',
        method: 'get',
        page: 'usage',
        handler: require('../components/Deck/ContentPanel/ContentUsagePanel/ContentUsagePanel'),
        action: (context, payload, done) => {
            context.executeAction(loadContentUsage, payload, done);
        }
    },
    decktree: {
        path: '/decktree/:sid',
        method: 'get',
        page: 'decktree',
        handler: require('../components/Deck/TreePanel/TreePanel'),
        action: (context, payload, done) => {
            context.executeAction(loadDeckTree, payload, done);
        }
    }
};
