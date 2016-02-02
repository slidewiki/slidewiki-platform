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
    deck: {
        path: '/deck/:id?',
        method: 'get',
        page: 'deck',
        title: 'Deck',
        handler: require('../components/Deck/Deck')
    }
};
