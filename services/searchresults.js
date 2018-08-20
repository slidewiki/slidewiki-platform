import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import customDate from '../components/Deck/util/CustomDate';
import slugify from 'slugify';

const log = require('../configs/log').log;

function parseSlide(slide){
    slide.deck = {
        id: slide.usage[0],
        title: '',
        link: ''
    };
    slide.link = `/deck/${slide.usage[0]}/slide/${slide.db_id}-${slide.db_revision_id}`;
    slide.kind = 'Slide';
    slide.title = (slide.title && slide.title.length > 70) ? slide.title.substring(0,70)+'...' : slide.title;
    slide.description = (slide.content[0] && slide.content[0].length > 85) ? slide.content[0].substring(0,85)+'...' : slide.content[0];
    slide.lastUpdate = customDate.format(slide.lastUpdate, 'Do MMMM YYYY');
    slide.user = {
        id: slide.creator,
        username: '',
        link: ''
    };
}

function parseDeck(deck){
    let deckSlug = buildSlug(deck);
    // different link if this is a root deck or a sub-deck
    deck.link = (deck.isRoot || !deck.usage) ? `/deck/${deck.db_id}-${deck.db_revision_id}/${deckSlug}` : `/deck/${deck.usage[0]}/deck/${deck.db_id}-${deck.db_revision_id}`;
    deck.kind = 'Deck';
    deck.title = (deck.title && deck.title.length > 70) ? deck.title.substring(0,70)+'...' : deck.title;
    deck.description = (deck.description && deck.description.length > 85) ? deck.description.substring(0,85)+'...' : deck.description;
    deck.updated = deck.lastUpdate;     // this is used to sort deck family's decks
    deck.lastUpdate = customDate.format(deck.lastUpdate, 'Do MMMM YYYY');
    deck.user = {
        id: deck.creator,
        username: '',
        link: ''
    };
}

function buildSlug(deck) {
    return slugify(deck.title || '').toLowerCase() || '_';
}

function getUsers(userIdsSet){
    let userPromises = [];
    let usernames = {};

    // request usernames of user ids found
    for(let userId of userIdsSet){
        userPromises.push(rp.get({uri: `${Microservices.user.uri}/user/${userId}`, json: true}).then((userRes) => {
            usernames[userId] = { 
                displayName: userRes.displayName || userRes.username, 
                username: userRes.username
            };
        }).catch( (err) => {
            usernames[userId] = 'Unknown user';
        }));
    }

    return Promise.all(userPromises).then( () => { return usernames; });
}

function getDecks(deckIdsSet){
    let decks = {}, deckRevisions = {};
    let deckPromises = [];

    for(let deckId of deckIdsSet){
        deckPromises.push(rp.get({uri: `${Microservices.deck.uri}/deck/${deckId}`, json: true}).then( (deckRes) => {
            decks[deckId] = deckRes;
            decks[deckId].revisions.forEach( (rev) => {
                deckRevisions[deckId + '-' + rev.id] = rev;
            });
        }).catch( (err) => {
            decks[deckId] = null;
        }));
    }

    return Promise.all(deckPromises).then( () => { return {decks, deckRevisions}; });
}

function getForks(deckIdsSet){
    let forks = {};
    let forkPromises = [];

    for(let deckId of deckIdsSet){
        forkPromises.push(rp.get({uri: `${Microservices.deck.uri}/deck/${deckId}/forks`, json: true}).then((deckForks) => {
            forks[deckId] = deckForks.filter((f) => !f.hidden);
        }).catch( (err) => {
            forks[deckId] = [];
        }));
    }
    return Promise.all(forkPromises).then( () => { return forks; });
}

function getLikes(deckIdsSet){
    let likes = {};
    let likePromises = [];

    for(let deckId of deckIdsSet){
        likePromises.push(rp.get({uri: `${Microservices.activities.uri}/activities/deck/${deckId}?metaonly=true&activity_type=react&all_revisions=true`}).then((noOfLikes) => {
            likes[deckId] = noOfLikes;
        }).catch( (err) => {
            likes[deckId] = 0;
        }));
    }
    return Promise.all(likePromises).then( () => { return likes; });
}

export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});

        if(resource === 'searchresults.list'){

            // set keywords and sort, if not given
            params.query.keywords = (params.query.keywords.trim() === '') 
                ? '*:*' : params.query.keywords;
            params.query.sort = params.sort || 'score';

            // extra options for enabling results expansion, spellcheck and faceting
            let query = Object.assign({}, params.query);
            query.expand = true; 
            query.spellcheck = true;
            query.facets = true;

            // request search results from search service
            rp.get({
                uri: `${Microservices.search.uri}/search/v2`,
                json: true, 
                qs: query,
            }).then( (response) => {

                let userIds = new Set(), deckIds = new Set();

                response.docs.forEach( (res) => {

                    // keep user id to request later
                    if(res.creator !== null){
                        userIds.add(res.creator);
                    }

                    // transform results to return to frontend
                    if(res.kind === 'deck'){

                        parseDeck(res);

                        //keep deck id to request later
                        deckIds.add(res.db_id);
                    }
                    else if(res.kind === 'slide'){

                        parseSlide(res);

                        // keep more deck ids to request later
                        res.usage.forEach( (deckRev) => {
                            deckIds.add(deckRev.split('-')[0]);
                        });
                    }

                });

                // get required usernames
                let usernames = {};
                let userPromise = getUsers(userIds).then( (usernamesFromService) => {
                    usernames = usernamesFromService;
                });

                // get requires decks and deck revisions
                let decks = {}, deckRevisions = {};
                let deckPromise = getDecks(deckIds).then( (decksFromService) => {
                    decks = decksFromService.decks;
                    deckRevisions = decksFromService.deckRevisions;
                });

                // get deck forks to show as deck other versions
                let forks = {};
                let forksPromise = getForks(deckIds).then( (forksFromService) => {
                    forks = forksFromService;
                });

                // get number of likes for decks
                let likes = {};
                let likesPromise = getLikes(deckIds).then( (likesFromService) => {
                    likes = likesFromService;
                });

                Promise.all([userPromise, deckPromise, forksPromise, likesPromise]).then( () => {
                    response.docs.forEach( (returnItem) => {

                        // fill extra user info
                        let user = usernames[returnItem.user.id];
                        returnItem.user.username = user.displayName;
                        returnItem.user.link = '/user/' + user.username;

                        if(returnItem.kind === 'Deck'){

                            returnItem.revisionCount = (decks[returnItem.db_id]) ? decks[returnItem.db_id].revisions.length : 1;
                            returnItem.theme = (deckRevisions[`${returnItem.db_id}-${returnItem.db_revision_id}`]) ?
                                                        deckRevisions[`${returnItem.db_id}-${returnItem.db_revision_id}`].theme : '';

                            returnItem.firstSlide = (deckRevisions[`${returnItem.db_id}-${returnItem.db_revision_id}`]) ?
                                                        deckRevisions[`${returnItem.db_id}-${returnItem.db_revision_id}`].firstSlide : '';

                            // fill deck subitems (forks of the deck)
                            if(forks[returnItem.db_id].length > 0){
                                returnItem.subItems = forks[returnItem.db_id].map( (fork) => {
                                    return {
                                        id: fork.id,
                                        title: fork.title,
                                        link: `/deck/${fork.id}/${buildSlug(fork)}`,
                                    };
                                });
                            }

                            //fill number of likes
                            returnItem.noOfLikes = likes[returnItem.db_id];
                        }
                        else if(returnItem.kind === 'Slide'){
                            returnItem.subItems = returnItem.usage.filter( (usageItem) => {
                                // do not contain usage presented in result title
                                return (returnItem.deck.id !== usageItem) && deckRevisions[usageItem];
                            }).map( (usageItem) => {
                                return {
                                    id: usageItem,
                                    title: deckRevisions[usageItem].title,
                                    link: `/deck/${usageItem}/${buildSlug(deckRevisions[usageItem])}/slide/${returnItem.db_id}-${returnItem.db_revision_id}?language=${returnItem.language}`,
                                };
                            });

                            // fill deck info
                            returnItem.deck.title = (deckRevisions[returnItem.deck.id]) ? deckRevisions[returnItem.deck.id].title : '';
                            let deckSlug = buildSlug(returnItem.deck);
                            returnItem.deck.link = `/deck/${returnItem.deck.id}/${deckSlug}`;

                            returnItem.link = `/deck/${returnItem.usage[0]}/${deckSlug}/slide/${returnItem.db_id}-${returnItem.db_revision_id}?language=${returnItem.language}`;
                        }
                    });

                    callback(null, {
                        queryparams: params.query,
                        numFound: response.numFound,
                        hasMore: response.hasMore,
                        page: response.page,
                        spellcheck: response.spellcheck,
                        facets: response.facets,
                        docs: response.docs
                    });
                });

            }).catch((error) => {
                callback(error);
            });

        }
    }
};
