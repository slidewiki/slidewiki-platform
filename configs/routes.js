//general app config
import { shortTitle, fullTitle } from '../configs/general';
//list of actions
import loadContent from '../actions/loadContent';
import loadContributors from '../actions/loadContributors';
import loadSearchResults from '../actions/search/loadSearchResults';
import loadDeck from '../actions/loadDeck';
import loadSlideView from '../actions/slide/loadSlideView';
import loadSlideEdit from '../actions/slide/loadSlideEdit';
import loadDeckView from '../actions/loadDeckView';
import loadDeckEdit from '../actions/loadDeckEdit';
import loadDataSources from '../actions/datasource/loadDataSources';
import loadActivities from '../actions/activityfeed/loadActivities';
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
import loadLegacy from '../actions/loadLegacy';
import loadDeckFamily from '../actions/deckfamily/loadDeckFamily';
import loadDiffview from '../actions/loadDiffview';
import checkReviewableUser from '../actions/userReview/checkReviewableUser';

import {navigateAction} from 'fluxible-router';

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
                (callback) => {context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: fullTitle});
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
    contactus: {
        path: '/contactus',
        method: 'get',
        page: 'contactus',
        title: 'SlideWiki -- Contact Us',
        handler: require('../components/Home/ContactUs'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | Contact Us'
            });
            done();
        }
    },
    license: {
        path: '/license',
        method: 'get',
        page: 'license',
        title: 'SlideWiki -- Content licenses',
        handler: require('../components/Home/License'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | Content Licenses'
            });
            done();
        }
    },
    features: {
        path: '/features',
        method: 'get',
        page: 'features',
        title: 'SlideWiki -- Features',
        handler: require('../components/Home/Features'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | Features'
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
    welcome: {
        path: '/welcome',
        method: 'get',
        page: 'Welcome',
        title: 'SlideWiki -- Welcome',
        handler: require('../components/Home/Welcome'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | Welcome'
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
            context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: shortTitle + ' | Sign up'});
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
    userprofilereview: {
        path: '/Sfn87Pfew9Af09aM',
        method: 'get',
        page: 'userprofilereview',
        title: 'SlideWiki -- user review',
        handler: require('../components/User/UserProfile/UserProfileReview'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {pageTitle: shortTitle + ' | User review'});
            done();
        }
    },
    userprofilereviewuser: {
        path: '/Sfn87Pfew9Af09aM/user/:username/',
        method: 'get',
        page: 'userprofilereview',
        title: 'SlideWiki -- user review',
        handler: require('../components/User/UserProfile/UserProfileReviewUser'),
        action: (context, payload, done) => {
            async.series([
                (callback) => {
                    context.executeAction(checkReviewableUser, payload, callback);
                },
                (callback) => {
                    context.executeAction(chooseAction, payload, callback);
                }
            ],
            (err, result) => {
                if(err) console.log(err);
                done();
            });
        }
    },
    search: {
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
    // theme: For testing, choice of any of the reveal.js themes
    deck: {
        path: '/deck/:id(\\d+|\\d+-\\d+)/:stype?/:sid?/:spath?/:mode?/:theme?',
        method: 'get',
        page: 'deck',
        handler: require('../components/Deck/Deck'),
        action: (context, payload, done) => {
            context.executeAction(loadDeck, payload, done);
        }
    },
    legacydeck: {
        path: '/deck/:oldid(\\d+_\\w+.*)',
        method: 'get',
        action: (context, payload, done) => {
            context.executeAction(loadLegacy, payload, done);
        }
    },
    diffview: {
        path: '/diffview/:stype/:sid/:did',
        method: 'get',
        page: 'diffview',
        handler: require('../components/Deck/Diffview/Diffview'),
        action: (context, payload, done) => {
            context.executeAction(loadDiffview, payload, done);
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
        path: '/content/:stype/:sid/:mode?/:theme?',
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
            async.series([
                (callback) => {
                    context.dispatch('UPDATE_PAGE_TITLE', {
                        pageTitle: shortTitle + ' | Activities'
                    });
                    callback();
                },
                (callback) => {
                    context.executeAction(loadActivities, payload, done);
                }
            ],
            (err, result) => {
                if(err) console.log(err);
                done();
            });
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
        path: '/questions/:stype/:sid/:maxQ/:pageNum',
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
    infopanel:{
        path: '/infopanel/:id/:spath?',
        method: 'get',
        page: 'decktree',
        handler: require('../components/Deck/InfoPanel/InfoPanel'),
        action: (context, payload, done) => {
            context.executeAction(loadDeckTree, payload, done);
        }

    },


    presentation: {
        path: '/presentation/:id/:subdeck/:sid?',
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
            context.executeAction(loadAddDeck, payload, done);
        }
    },
    socialLogin: {
        path: '/socialLogin',
        method: 'get',
        page: 'socialLogin',
        title: 'SlideWiki -- Login',
        handler: require('../components/Login/Social'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | Login'
            });
            done();
        }
    },

    ltiLogin: {
        path: '/ltiLogin',
        method: 'get',
        page: 'ltiLogin',
        title: 'SlideWiki -- Login',
        handler: require('../components/Login/LTI'),
        action: (context, payload, done) => {
            context.dispatch('UPDATE_PAGE_TITLE', {
                pageTitle: shortTitle + ' | Login'
            });
            done();
        }
    },

    deckfamily: {
        path: '/deckfamily/:tag',
        method: 'get',
        page: 'deckfamily',
        title: 'SlideWiki -- Deck Family',
        handler: require('../components/Deck/DeckFamily/DeckFamily'),
        action: (context, payload, done) => {
            context.executeAction(loadDeckFamily, payload, done);
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
