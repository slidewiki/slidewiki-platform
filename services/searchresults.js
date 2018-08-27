import { Microservices } from '../configs/microservices';
import rp from 'request-promise-native';
import customDate from '../components/Deck/util/CustomDate';
import slugify from 'slugify';
import { isEmpty, compact, flatten, uniq } from 'lodash';

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

function parseDeck(deck, usernames){
    let deckSlug = buildSlug(deck);
    // different link if this is a root deck or a sub-deck
    deck.link = (deck.isRoot || !deck.usage) ? `/deck/${deck.db_id}-${deck.db_revision_id}/${deckSlug}` : `/deck/${deck.usage[0]}/deck/${deck.db_id}-${deck.db_revision_id}`;
    deck.kind = 'Deck';
    deck.title = (deck.title && deck.title.length > 70) ? deck.title.substring(0,70)+'...' : deck.title;
    deck.description = (deck.description && deck.description.length > 85) ? deck.description.substring(0,85)+'...' : deck.description;
    deck.updated = deck.lastUpdate;     // this is used to sort deck family's decks
    deck.lastUpdate = customDate.format(deck.lastUpdate, 'Do MMMM YYYY');
    let user = usernames[deck.creator];
    deck.user = {
        id: deck.creator,
        username: user.displayName,
        link: '/user/' + user.username,
    };

    // TODO: do not return content from service
    delete deck.content;
    (deck.forks || []).forEach( (fork) => delete fork.content);
}

function buildSlug(deck) {
    return slugify(deck.title || '').toLowerCase() || '_';
}

function getUsers(userIds){
    let usernames = {};
    let userPromises = userIds.map( (userId) => 
        rp.get({uri: `${Microservices.user.uri}/user/${userId}`, json: true}).then((userRes) => {
            usernames[userId] = { 
                displayName: userRes.displayName || userRes.username, 
                username: userRes.username
            };
        }).catch( (err) => {
            usernames[userId] = 'Unknown user';
        }));

    return Promise.all(userPromises).then( () => { return usernames; });
}

function getDecks(deckIds){
    let decks = {}, deckRevisions = {};
    let deckPromises = deckIds.map( (deckId) => 
        rp.get({uri: `${Microservices.deck.uri}/deck/${deckId}`, json: true}).then( (deckRes) => {
            decks[deckId] = deckRes;
            decks[deckId].revisions.forEach( (rev) => {
                deckRevisions[deckId + '-' + rev.id] = rev;
            });
        }).catch( (err) => {
            decks[deckId] = null;
        }));


    return Promise.all(deckPromises).then( () => { return {decks, deckRevisions}; });
}

function getForks(deckIds){
    let forks = {};
    let forkPromises = deckIds.map( (deckId) => 
        rp.get({uri: `${Microservices.deck.uri}/deck/${deckId}/forks`, json: true}).then((deckForks) => {
            forks[deckId] = deckForks.filter((f) => !f.hidden);
        }).catch( (err) => {
            forks[deckId] = [];
        }));

    return Promise.all(forkPromises).then( () => { return forks; });
}

function getActivity(activityType, deckIds){
    let activities = {};
    let likePromises = deckIds.map( (deckId) => 
        rp.get({
            uri: `${Microservices.activities.uri}/activities/deck/${deckId}`, 
            qs: {
                metaonly: true, 
                activity_type: activityType, 
                all_revisions: true,
            }
        }).then((noOfLikes) => {
            activities[deckId] = noOfLikes;
        }).catch( (err) => {
            activities[deckId] = 0;
        }));

    return Promise.all(likePromises).then( () => { return activities; });
}

function fillUserInfo(usernames, userId){

}

export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});

        if(resource === 'searchresults.list'){

            // if empty keywords are given, then search for all
            params.query.keywords = params.query.keywords || '*:*';

            // extra options for enabling results expansion, spellcheck and faceting
            let query = Object.assign({}, params.query);
            query.expand = true; 
            query.spellcheck = true;
            query.facets = true;
            query.kind = 'deck';
            query.pageSize = 20;

            // request search results from search service
            rp.get({
                uri: `${Microservices.search.uri}/search/v2`,
                json: true, 
                qs: query,
                useQuerystring: true,
            }).then( (response) => {

                let deckIds = response.docs.map( (result) => result.db_id);
                let userIds = compact(uniq(flatten(response.docs.map( (result) => {
                    if (isEmpty(result.forks)) { 
                        return result.creator; 

                    // if matching forks are availabe, collect user ids for them also
                    } else {
                        let forkUserIds = result.forks.map( (fork) => fork.creator);
                        forkUserIds.push(result.creator);
                        return forkUserIds;
                    }
                }))));

                Promise.all([ getUsers(userIds), getDecks(deckIds), getActivity('react', deckIds), getActivity('download', deckIds), getActivity('share', deckIds)])
                .then( ([ usernames, { decks, deckRevisions }, likes, downloads, shares ]) => {
                    response.docs.forEach( (result) => {

                        parseDeck(result, usernames);

                        // fill forks data
                        if (!isEmpty(result.forks)) {
                            result.forks.forEach( (fork) => parseDeck(fork, usernames));
                        }


                        // if(returnItem.kind === 'Deck'){

                        result.revisionCount = (decks[result.db_id]) ? decks[result.db_id].revisions.length : 1;
                        result.theme = (deckRevisions[`${result.db_id}-${result.db_revision_id}`]) ?
                                                    deckRevisions[`${result.db_id}-${result.db_revision_id}`].theme : '';

                        result.firstSlide = (deckRevisions[`${result.db_id}-${result.db_revision_id}`]) ?
                                                    deckRevisions[`${result.db_id}-${result.db_revision_id}`].firstSlide : '';

                        //fill number of likes, downloads and shares
                        result.noOfLikes = likes[result.db_id];
                        result.downloadsCount = downloads[result.db_id];
                        result.sharesCount = shares[result.db_id];
                        
                        // }
                        // else if(returnItem.kind === 'Slide'){
                        //     returnItem.subItems = returnItem.usage.filter( (usageItem) => {
                        //         // do not contain usage presented in result title
                        //         return (returnItem.deck.id !== usageItem) && deckRevisions[usageItem];
                        //     }).map( (usageItem) => {
                        //         return {
                        //             id: usageItem,
                        //             title: deckRevisions[usageItem].title,
                        //             link: `/deck/${usageItem}/${buildSlug(deckRevisions[usageItem])}/slide/${returnItem.db_id}-${returnItem.db_revision_id}?language=${returnItem.language}`,
                        //         };
                        //     });

                        //     // fill deck info
                        //     returnItem.deck.title = (deckRevisions[returnItem.deck.id]) ? deckRevisions[returnItem.deck.id].title : '';
                        //     let deckSlug = buildSlug(returnItem.deck);
                        //     returnItem.deck.link = `/deck/${returnItem.deck.id}/${deckSlug}`;

                        //     returnItem.link = `/deck/${returnItem.usage[0]}/${deckSlug}/slide/${returnItem.db_id}-${returnItem.db_revision_id}?language=${returnItem.language}`;
                        // }
                    });

                    callback(null, {
                        numFound: response.numFound,
                        hasMore: response.hasMore,
                        page: response.page,
                        spellcheck: response.spellcheck,
                        facets: response.facets,
                        docs: response.docs
                    });
                }).catch(callback);

            }).catch(callback);

        }
    }
};
