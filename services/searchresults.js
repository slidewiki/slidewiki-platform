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

    // needed for deck card
    deck.slug = deckSlug;
    deck.deckID = deck.db_id;
    
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
            usernames[userId] = {
                displayName: `Unknown user ${userId}`, 
                username: userId
            };
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

function getUserIds(docs, facets){
    let userIds = flatten(docs.map( (result) => {
        if (isEmpty(result.forks)) { 
            return result.creator; 

        // if matching forks are availabe, collect user ids for them also
        } else {
            let forkUserIds = result.forks.map( (fork) => fork.creator);
            forkUserIds.push(result.creator);
            return forkUserIds;
        }
    }));

    // if faceting is enabled, also require usernames for user ids in facets
    if (facets && facets.creator) {

        // user ids are returned as strings in facets response
        facets.creator.forEach( (item) => {
            item.val = parseInt(item.val);
        });

        let creatorIds = facets.creator.map( (item) => item.val);
        userIds = userIds.concat(creatorIds);
    }

    return compact(uniq(userIds));
}

function fillFacetsInfo(facets, usernames, tags) {
    facets.creator.forEach( (item) => {
        item.user = usernames[item.val];
    });

    facets.tags.forEach( (item) => {
        item.defaultName = tags[item.val];
    });
}

function getRequestOptions(params) {
    if (params.nextLink) {
        return {
            uri: `${Microservices.search.uri}${params.nextLink}`, 
            json: true,
        };
    } else {

        // if empty keywords are given, then search for all
        params.query.keywords = params.query.keywords || '*:*';

        // extra options for enabling results expansion, spellcheck and faceting
        let query = Object.assign({}, params.query);
        query.expand = (params.query.hasOwnProperty('expand')) ? params.query.expand : true; 
        query.spellcheck = (params.query.hasOwnProperty('spellcheck')) ? params.query.spellcheck : true;
        query.facets = (params.query.hasOwnProperty('facets')) ? params.query.facets : true;
        query.kind = 'deck';
        query.pageSize = params.query.pageSize || 20;

        return {
            uri: `${Microservices.search.uri}/search/v2`,
            json: true, 
            qs: query,
            useQuerystring: true,
        };
    }
}

function getTags(facets) {
    if (!facets || !facets.tags) {
        return Promise.resolve();
    }

    let tags = {};

    let tagPromises = facets.tags.map( (facetTag) => 
        rp.get({uri: `${Microservices.tag.uri}/tag/${facetTag.val}`, json: true}).then( (tag) => {
            tags[tag.tagName] = tag.defaultName;
        }).catch( (err) => {
            tags[facetTag.val] = facetTag.val;
        }));

    return Promise.all(tagPromises).then( () => { return tags; });
}

export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});

        if(resource === 'searchresults.list'){

            let options = getRequestOptions(params);

            // request search results from search service
            rp.get(options).then( (response) => {

                let deckIds = response.docs.map( (result) => result.db_id);
                let userIds = getUserIds(response.docs, response.facets);

                Promise.all([ 
                    getUsers(userIds), 
                    getDecks(deckIds), 
                    getActivity('react', deckIds), 
                    getActivity('download', deckIds), 
                    getActivity('share', deckIds),
                    getTags(response.facets),
                ]).then( ([ usernames, { decks, deckRevisions }, likes, downloads, shares, tags ]) => {
                    response.docs.forEach( (result) => {

                        parseDeck(result, usernames);

                        // fill forks data
                        if (!isEmpty(result.forks)) {
                            result.forks.forEach( (fork) => parseDeck(fork, usernames));
                        }

                        result.revisionCount = (decks[result.db_id]) ? decks[result.db_id].revisions.length : 1;
                        result.theme = (deckRevisions[`${result.db_id}-${result.db_revision_id}`]) ?
                                                    deckRevisions[`${result.db_id}-${result.db_revision_id}`].theme : '';

                        result.firstSlide = (deckRevisions[`${result.db_id}-${result.db_revision_id}`]) ?
                                                    deckRevisions[`${result.db_id}-${result.db_revision_id}`].firstSlide : '';

                        //fill number of likes, downloads and shares
                        result.noOfLikes = likes[result.db_id];
                        result.downloadsCount = downloads[result.db_id];
                        result.sharesCount = shares[result.db_id];
                        
                    });

                    if (response.facets) {
                        fillFacetsInfo(response.facets, usernames, tags);
                    }

                    callback(null, {
                        numFound: response.numFound,
                        hasMore: response.hasMore,
                        links: response.links,
                        spellcheck: response.spellcheck,
                        facets: response.facets,
                        docs: response.docs
                    });
                }).catch(callback);

            }).catch(callback);

        }
    }
};
