import routes from '../../../configs/routes';

export default {
    openSlideshow: {
        type: 'action',
        event: 'click',
        targetId: 'openSlideshow',
        listenTo: ['open this as slideshow', 'open as slideshow', 'open deck as slideshow'],
        answer: 'the slideshow is opened in a new tab',
        pages: [routes.deck.path],
    },
    lastSlide: {
        type: 'action',
        event: 'click',
        targetId: 'lastSlide',
        listenTo: ['last slide'],
        answer: 'last slide',
        pages: [routes.deck.path],
    },
    firstSlide: {
        type: 'action',
        event: 'click',
        targetId: 'firstSlide',
        listenTo: ['first slide'],
        answer: 'first slide',
        pages: [routes.deck.path],
    },
    previousSlide: {
        type: 'action',
        event: 'click',
        targetId: 'previousSlide',
        listenTo: ['previous slide'],
        answer: 'previous slide',
        pages: [routes.deck.path],
    },
    nextSlide: {
        type: 'action',
        event: 'click',
        targetId: 'nextSlide',
        listenTo: ['next slide'],
        answer: 'next slide',
        pages: [routes.deck.path],
    },
    likeDeck: {
        type: 'action',
        event: 'click',
        targetId: 'likeDeck',
        listenTo: ['like this deck', 'like deck'],
        answer: 'you liked this deck',
        pages: [routes.deck.path],
    },
    editDeckSettings: {
        type: 'action',
        event: 'click',
        targetId: 'editDeckSettings',
        listenTo: ['edit this deck', 'edit deck settings'],
        answer: 'you can now edit the deck settings',
        pages: [routes.deck.path],
    },
    addDeck: {
        type: 'navigation',
        listenTo: ['add a new deck', 'create a new deck', 'add deck'],
        navigateTo: '/addDeck',
        answer: 'you can now create a new deck',
        pages: ['*'],
    },
    navigateTo: {
        type: 'navigation',
        listenTo: [
            'navigate to', //[page]
        ],
        navigateTo: null,
        params: {
            page: [
                {
                    name: 'home',
                    path: '/',
                },
                {
                    name: 'about us',
                    path: '/about',
                },
                {
                    name: 'contact us',
                    path: '/contactus',
                },
            ],
        },
        answer: 'navigating to requested page',
        pages: ['*'],
        example: 'Navigate to [home/about us/etc.]'
    },
    searchFor: {
        type: 'navigation',
        listenTo: [
            'search for', //[page]
        ],
        navigateTo: '/search?keywords=[param]&sort=score',
        answer: 'searching for decks',
        pages: ['*'],
        example: 'Search for RDF'
    },
};
