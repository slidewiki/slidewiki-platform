//general app config
import {shortTitle, fullTitle} from '../configs/general';
//list of actions
import loadContent from '../actions/loadContent';
import loadContributors from '../actions/loadContributors';
import loadDeck from '../actions/loadDeck';
import loadSlideContent from '../actions/loadSlideContent';
import loadDeckContent from '../actions/loadDeckContent';
import loadDataSources from '../actions/loadDataSources';

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
    slidecontent: {
        path: '/slidecontent/:sid/:mode?',
        method: 'get',
        page: 'slidecontent',
        handler: require('../components/Deck/ContentPanel/SlidePanel/SlidePanel'),
        action: (context, payload, done) => {
            context.executeAction(loadSlideContent, payload, done);
        }
    },
    deckcontent: {
        path: '/deckcontent/:sid/:mode?',
        method: 'get',
        page: 'deckcontent',
        handler: require('../components/Deck/ContentPanel/DeckPanel/DeckPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadDeckContent, payload, done);
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
    }
};
