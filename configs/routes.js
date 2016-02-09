//list of actions
import loadContributors from '../actions/loadContributors';
import loadDeck from '../actions/loadDeck';

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
        path: '/contributors/:ctype/:id',
        method: 'get',
        page: 'contributors',
        handler: require('../components/Deck/ContributorsPanel/ContributorsPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadContributors, payload, done);
        }
    }
};
