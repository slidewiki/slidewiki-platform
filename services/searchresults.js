import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import customDate from '../components/Deck/util/CustomDate';
const log = require('../configs/log').log;

function extractSpellcheckSuggestion(spellcheck){

    if(!spellcheck) return '';      // spellcheck is not defined

    if(spellcheck.collations && spellcheck.collations.length > 0){
        // collations are returned in an array with the term 'collation' in odd cells
        // and the actual collations in even cells
        for(let i=1; i<spellcheck.collations.length; i+=2){
            let collation = spellcheck.collations[i].collationQuery;
            let col = '';
            let index = 1;

            // if query was made against a specific field, remove this field name from the collation
            if(collation.startsWith('title:') || collation.startsWith('description:') ||
                    collation.startsWith('content:') || collation.startsWith('speakernotes:')){

                index = collation.indexOf(':') + 2;
            }
            return collation.substring(index, collation.length-1); //terms are inside parentheses
        }
    }
    else if(spellcheck.suggestions && spellcheck.suggestions.length > 0){
        let suggestion = '';

        // collations are not present, so concatenate suggestions of individual terms
        for(let i=1; i<spellcheck.suggestions.length; i+=2){
            suggestion += spellcheck.suggestions[i].suggestion[0].word + ' ';
        }
        return suggestion.trim();

    }

    return '';
}

function parseSlide(slide){
    slide.deck = {
        id: slide.usage[0],
        title: '',
        link: ''
    };
    slide.link = `/deck/${slide.usage[0]}/slide/${slide.db_id}-${slide.db_revision_id}`;
    slide.kind = 'Slide';
    slide.title = (slide.title && slide.title.length > 70) ? slide.title.substring(0,70)+'...' : slide.title;
    slide.description = (slide.content && slide.content.length > 85) ? slide.content.substring(0,85)+'...' : slide.content;
    slide.lastUpdate = customDate.format(slide.lastUpdate, 'Do MMMM YYYY');
    slide.user = {
        id: slide.creator,
        username: '',
        link: ''
    };
}

function parseDeck(deck){
    // different link if this is a root deck or a sub-deck
    deck.link = (deck.isRoot || !deck.usage) ? `/deck/${deck.db_id}-${deck.db_revision_id}` : `/deck/${deck.usage[0]}/deck/${deck.db_id}-${deck.db_revision_id}`;
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

function getUsers(userIdsSet){
    let userPromises = [];
    let usernames = {};

    // request usernames of user ids found
    for(let userId of userIdsSet){
        userPromises.push(rp.get({uri: `${Microservices.user.uri}/user/${userId}`, json: true}).then((userRes) => {
            usernames[userId] = userRes.username;
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
            forks[deckId] = deckForks;
        }).catch( (err) => {
            forks[deckId] = [];
        }));
    }
    return Promise.all(forkPromises).then( () => { return forks; });
}

export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params? params.params : params;

        if(resource === 'searchresults.list'){

            // extra options for enabling results expansion, spellcheck and faceting
            let requestOptions = '&expand=true&spellcheck=true&facets=false';

            // console.log(args.queryparams);

            // request search results from search service
            rp.get({
                uri: `${Microservices.search.uri}/search/v2?${args.queryparams}${requestOptions}`, 
                json: true
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


                Promise.all([userPromise, deckPromise, forksPromise]).then( () => {
                    response.docs.forEach( (returnItem) => {

                        // fill extra user info
                        returnItem.user.username = usernames[returnItem.user.id];
                        returnItem.user.link = '/user/' + returnItem.user.username;

                        if(returnItem.kind === 'Deck'){

                            returnItem.revisionsCount = (decks[returnItem.db_id]) ? decks[returnItem.db_id].revisions.length : 1;
                            returnItem.firstSlide = (deckRevisions[`${returnItem.db_id}-${returnItem.db_revision_id}`]) ?
                                deckRevisions[`${returnItem.db_id}-${returnItem.db_revision_id}`].firstSlide : '';

                            // fill deck subitems (forks of the deck)
                            if(forks[returnItem.db_id].length > 0){
                                returnItem.subItems = forks[returnItem.db_id].map( (fork) => {
                                    return {
                                        id: fork.id, 
                                        title: fork.title, 
                                        link: `/deck/${fork.id}`
                                    };
                                });
                            }
                        }
                        else if(returnItem.kind === 'Slide'){
                            returnItem.subItems = returnItem.usage.filter( (usageItem) => {
                                // do not contain usage presented in result title
                                return (returnItem.deck.id !== usageItem) && deckRevisions[usageItem];
                            }).map( (usageItem) => {
                                return {
                                    id: usageItem,
                                    title: deckRevisions[usageItem].title,
                                    link: '/deck/' + usageItem + '/slide/' + returnItem.db_id + '-' + returnItem.db_revision_id
                                };
                            });

                            // fill deck info
                            returnItem.deck.title = (deckRevisions[returnItem.deck.id]) ? deckRevisions[returnItem.deck.id].title : '';
                            returnItem.deck.link = '/deck/' + returnItem.deck.id;
                        }
                    });

                    callback(null, {
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
