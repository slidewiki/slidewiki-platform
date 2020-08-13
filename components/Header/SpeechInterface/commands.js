export default {
    openSlideshow: {
        type: 'action', 
        event: 'click',
        targetId: 'openSlideshow',
        listenTo: [
            'open this as slideshow',
            'open as slideshow',
            'open deck as slideshow'
        ],
        answer: 'the slideshow is opened in a new tab'
    },
    editDeckSettings: {
        type: 'action', 
        event: 'click',
        targetId: 'editDeckSettings',
        listenTo: [
            'edit this deck',
            'edit deck settings',
        ],
        answer: 'you can now edit the deck settings'
    },
    addDeck: {
        type: 'navigation', 
        listenTo: [
            'add a new deck',
            'create a new deck',
            'add deck',
        ],
        navigateTo: '/addDeck',
        answer: 'you can now create a new deck'
    },
    navigateTo: {
        type: 'navigation', 
        listenTo: [
            'navigate to' //[page]
        ],
        navigateTo: null,
        params: {
            page: [
                {
                    name: 'home', 
                    path: '/' 
                },
                {
                    name: 'about us', 
                    path: '/about' 
                },
                {
                    name: 'contact us', 
                    path: '/contactus' 
                }
            ]
        },
        answer: 'navigating to requested page'
    },
    searchFor: {
        type: 'navigation', 
        listenTo: [
            'search for' //[page]
        ],
        navigateTo: '/search?keywords=[param]&sort=score',
        answer: 'searching for decks'
    },
}
