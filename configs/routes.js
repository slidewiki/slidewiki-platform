//list of actions
import loadContent from '../actions/loadContent';
import loadContributors from '../actions/loadContributors';
import loadDeck from '../actions/loadDeck';
import loadSlideContent from '../actions/loadSlideContent';
import loadDeckContent from '../actions/loadDeckContent';

export default {
    //-----------------------------------HomePage routes------------------------------
    home: {
        path: '/',
        method: 'get',
        page: 'home',
        title: 'SlideWiki -- Home',
        handler: require('../components/Home/Home')
    },
    about: {
        path: '/about',
        method: 'get',
        page: 'about',
        title: 'SlideWiki -- About',
        handler: require('../components/Home/About')
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
    }
};
