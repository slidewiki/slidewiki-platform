//general app config
import { shortTitle, fullTitle } from '../configs/general';
//list of actions
import loadContent from '../actions/loadContent';
import loadContributors from '../actions/loadContributors';
import loadSearchResults from '../actions/search/loadSearchResults';
// import loadAdvancedSearchResults from '../actions/search/updateUserResultsVisibility';
import loadDeck from '../actions/loadDeck';
import loadSlideView from '../actions/slide/loadSlideView';
//import loadSlideEdit from '../actions/slide/loadSlideEdit';
import loadSlideEditWihtRevisionControl from '../actions/slide/loadSlideEditWithRevisionControl';
import loadDeckView from '../actions/loadDeckView';
import loadDeckEdit from '../actions/loadDeckEdit';
import loadDataSources from '../actions/datasource/loadDataSources';
import loadActivities from '../actions/activityfeed/loadActivities';
import loadUserNotifications from '../actions/user/notifications/loadUserNotifications';
import loadDeckTree from '../actions/decktree/loadDeckTree';
import loadTranslations from '../actions/loadTranslations';
import loadContentHistory from '../actions/history/loadContentHistory';
import loadContentUsage from '../actions/loadContentUsage';
import loadContentQuestions from '../actions/loadContentQuestions';
import loadContentDiscussion from '../actions/contentdiscussion/loadContentDiscussion';
import loadSimilarContents from '../actions/loadSimilarContents';
import loadImportFile from '../actions/loadImportFile';
import loadPresentation from '../actions/loadPresentation';
import loadAddDeck from '../actions/loadAddDeck';
import loadNotFound from '../actions/loadNotFound';
import loadResetPassword from '../actions/loadResetPassword';
import async from 'async';
import { chooseAction } from '../actions/user/userprofile/chooseAction';
import loadFeatured from '../actions/loadFeatured';
import loadRecent from '../actions/loadRecent';

export default {
    //-----------------------------------HomePage routes------------------------------
    home: {
        path: '/',
        method: 'get',
        page: 'home',
        title: 'SlideWiki -- Home',
        handler: require('../components/Home/Home'),
        action: (context, payload, done) => {
            async.series([
                (callback) => {
                    context.dispatch('UPDATE_PAGE_TITLE', {
                        pageTitle: fullTitle
                    });
                    callback();
                },
                (callback) => {
                    context.executeAction(loadFeatured, {params: {limit: 3, offset: 0}}, callback);
                },
                (callback) => {
                    context.executeAction(loadRecent, {params: {limit: 3, offset: 0}}, callback);
                }
            ],
            (err, result) => {
                if(err) console.log(err);
                done();
            });
        }
    },

    recentDecks: {
        path: '/recent/:limit?/:offset?',
        method: 'get',
        page: 'featuredDecks',
        title: 'Slidewiki -- recent decks',
        handler: require('../components/Home/Recent'),
        action: (context, payload, done) => {
            async.series([
                (callback) => {
                    context.dispatch('UPDATE_PAGE_TITLE', {
                        pageTitle: shortTitle + ' | Recent Decks'
                    });
                    callback();
                },
                (callback) => {
                    context.executeAction(loadRecent, {params: {limit: 100, offset: 0}}, callback); //for now limit 100, can change this later to infinite scroll
                }
            ],
            (err, result) => {
                if(err) console.log(err);
                done();
            });
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
    imprint: {
        path: '/imprint',
        method: 'get',
        page: 'imprint',
        title: 'SlideWiki -- Imprint',
        handler: require('../components/Home/Imprint'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | Imprint'
            });
            done();
        }
    },
    dataprotection: {
        path: '/dataprotection',
        method: 'get',
        page: 'dataprotection',
        title: 'SlideWiki -- Data Protection Policy',
        handler: require('../components/Home/DataProtection'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | Data Protection Policy'
            });
            done();
        }
    },
    notifications: {
        path: '/notifications',
        method: 'get',
        page: 'notifications',
        title: 'SlideWiki -- User notifications',
        handler: require('../components/User/UserNotificationsPanel/UserNotificationsPanel'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | User notifications'
            });
            done();
        }
    },
    signup: {
        path: '/signup',
        method: 'get',
        page: 'signup',
        title: 'SlideWiki -- Sign up',
        handler: require('../components/User/UserRegistration/UserRegistration'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | Sign up'
            });
            done();
        }
    },
    resetPassword: {
        path: '/resetpassword',
        method: 'get',
        page: 'resetPassword',
        title: 'SlideWiki -- Reset your password',
        handler: require('../components/Login/ResetPassword'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | Reset password'
            });
            context.executeAction(loadResetPassword, payload, done);
        }
    },
    userprofile: {
        path: '/user/:username/:category?/:item?',
        method: 'get',
        page: 'userprofile',
        title: 'SlideWiki -- Your profile',
        handler: require('../components/User/UserProfile/UserProfile'),
        action: (context, payload, done) => {
            context.executeAction(chooseAction, payload, done);
        }
    },
    search: {
        // path: '/search/:searchstatus/:searchstring?/:entity?/:searchlang?/:deckid?/:userid?',
        path: '/search/:queryparams?',
        method: 'get',
        page: 'search',
        title: 'SlideWiki -- Search',
        handler: require('../components/Search/SearchPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadSearchResults, payload, done);
        }
    },

    //-----------------------------------DeckPage routes------------------------------
    // selector {id: 'id of parent deck; may contain [0-9-]',
    // stype: 'type of selected content e.g. slide, deck or question',
    // sid: 'id of selected content; may contain [0-9a-zA-Z-]',
    // spath: 'path of the content in deck tree, separated by semi-colon and colon for its position e.g. 67:3;45:1;45:4'; may contain [0-9a-z:;-],
    // mode: 'interaction mode e.g. view, edit, questions, datasources'}
    deck: {
        path: '/deck/:id/:stype?/:sid?/:spath?/:mode?',
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
        handler: require('../components/Deck/ContentModulesPanel/ContributorsPanel/ContributorsPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadContributors, payload, done);
        }
    },
    similarcontent: {
        path: '/similarcontent/:stype/:sid',
        method: 'get',
        page: 'similarcontent',
        handler: require('../components/Deck/SimilarContentPanel/SimilarContentPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadSimilarContents, payload, done);
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
            //context.executeAction(loadSlideEdit, payload, done);
            context.executeAction(loadSlideEditWihtRevisionControl, payload, done);
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
        handler: require('../components/Deck/ContentModulesPanel/DataSourcePanel/DataSourcePanel'),
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
        handler: require('../components/Deck/ContentModulesPanel/ContentHistoryPanel/ContentHistoryPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadContentHistory, payload, done);
        }
    },
    usage: {
        path: '/usage/:stype/:sid',
        method: 'get',
        page: 'usage',
        handler: require('../components/Deck/ContentModulesPanel/ContentUsagePanel/ContentUsagePanel'),
        action: (context, payload, done) => {
            context.executeAction(loadContentUsage, payload, done);
        }
    },
    questions: {
        path: '/questions/:stype/:sid',
        method: 'get',
        page: 'questions',
        handler: require('../components/Deck/ContentModulesPanel/ContentQuestionsPanel/ContentQuestionsPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadContentQuestions, payload, done);
        }
    },
    discussion: {
        path: '/discussion/:stype/:sid',
        method: 'get',
        page: 'discussion',
        handler: require('../components/Deck/ContentModulesPanel/ContentDiscussionPanel/ContentDiscussionPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadContentDiscussion, payload, done);
        }
    },
    decktree: {
        path: '/decktree/:id/:spath?',
        method: 'get',
        page: 'decktree',
        handler: require('../components/Deck/TreePanel/TreePanel'),
        action: (context, payload, done) => {
            context.executeAction(loadDeckTree, payload, done);
        }
    },
    presentation: {
        // In reveal.js we have id/#/sid, but the routes.js doesn't accept the hash/pound sign (#)
        path: '/presentation/:id/',
        method: 'get',
        page: 'presentation',
        handler: require('../components/Deck/Presentation/Presentation'),
        action: (context, payload, done) => {
            context.executeAction(loadPresentation, payload, done);
        }
    },
    /*
    presentationPrint: {
        path: '/presentationprint/:id/*',
        method: 'get',
        page: 'presentationprint',
        handler: require('../components/Deck/Presentation/PresentationPrint'),
        action: (context, payload, done) => {
            context.executeAction(loadPresentation, payload, done);
        }
    },
    */
    presentationSlide: {
        // In reveal.js we have id/#/sid, but the routes.js doesn't accept the hash/pound sign (#)
        path: '/presentation/:id/*/:sid?/',
        method: 'get',
        page: 'presentation',
        handler: require('../components/Deck/Presentation/Presentation'),
        action: (context, payload, done) => {
            context.executeAction(loadPresentation, payload, done);
        }
    },
    importfile: {
        path: '/importfile',
        method: 'post',
        page: 'importfile',
        handler: require('../actions/loadImportFile'),
        action: (context, payload, done) => {
            context.executeAction(loadImportFile, payload, done);
            //context.executeAction(loadPresentation, payload, done);
            //context.executeAction(loadDeck, payload, done);
        }
    },
    addDeck: {
        path: '/addDeck',
        method: 'get',
        page: 'addDeck',
        title: 'SlideWiki -- Add Deck',
        handler: require('../components/AddDeck/AddDeck'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | Add Deck'
            });
            context.executeAction(loadAddDeck, null, done);
        }
    },
    /* This should be the last route in routes.js */
    notfound: {
        path: '*',
        method: 'get',
        handler: require('../components/Error/Dummy'),
        action: (context, payload, done) => {
            context.executeAction(loadNotFound, payload, done);
        }
    }
    /***** DO NOT ADD ROUTES BELOW THIS LINE. *****/
};
