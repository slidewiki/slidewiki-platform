import { Microservices } from '../configs/microservices';
import rp from 'request-promise-native';
import customDate from '../components/Deck/util/CustomDate';
import slugify from 'slugify';
import { isEmpty, compact, flatten, uniq, keyBy, pick } from 'lodash';
import { getLanguageName }  from '../common';
import { getEducationLevel } from '../lib/isced.js';
const url = require('url');
const querystring = require('querystring');
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

function parseDeck(deck, users){
    let deckSlug = buildSlug(deck);

    // different link if this is a root deck or a sub-deck
    deck.link = (deck.isRoot || !deck.usage) 
        ? `/deck/${deck.db_id}-${deck.db_revision_id}/${deckSlug}?language=${deck.language}` 
        : `/deck/${deck.usage[0]}/deck/${deck.db_id}-${deck.db_revision_id}?language=${deck.language}`;
    deck.kind = 'Deck';
    deck.title = (deck.title && deck.title.length > 70) ? deck.title.substring(0,70)+'...' : deck.title;
    deck.description = (deck.description && deck.description.length > 85) ? deck.description.substring(0,85)+'...' : deck.description;
    deck.updated = deck.lastUpdate;     // this is used to sort deck family's decks
    deck.lastUpdate = customDate.format(deck.lastUpdate, 'Do MMMM YYYY');
    let user = users[deck.creator];
    deck.user = {
        id: deck.creator,
        username: user.displayName,
        link: '/user/' + user.username,
    };

    // needed for deck card
    deck.slug = deckSlug;
    deck.deckID = deck.db_id;
    deck.revisionCount = deck.revision_count;
}

function buildSlug(deck) {
    return slugify(deck.title || '').toLowerCase() || '_';
}

function getUsers(userIds){
    if (isEmpty(userIds)) {
        return Promise.resolve();
    }

    return rp.post({
        uri: `${Microservices.user.uri}/users`,
        body: userIds,
        json: true
    }).then((userData) => {
        userData = keyBy(userData, '_id');
        let users = {};
        userIds.forEach( (userId) => {
            let user = userData[userId];
            if (!user) {
                users[userId] = {
                    displayName: `Unknown user ${userId}`, 
                    username: userId.toString()
                };
            } else {
                users[userId] = { 
                    displayName: user.displayName || user.username, 
                    username: user.username
                };
            }
        });

        return users;
    });
}

function getDecks(deckIds){
    let decks = {}, deckRevisions = {};
    let deckPromises = deckIds.map( (deckId) => 
        rp.get({uri: `${Microservices.deck.uri}/deck/${deckId}`, json: true}).then( (deckRes) => {
            decks[deckId] = deckRes;
            decks[deckId].revisions.forEach( (rev, index, arr) => {
                deckRevisions[deckId + '-' + rev.id] = rev;
                
                if (index === arr.length - 1 && rev.educationLevel !== undefined) { //get educational level of last revision
                    decks[deckId].educationLevel = rev.educationLevel;
                }
            });
        }).catch( (err) => {
            decks[deckId] = null;
        }));


    return Promise.all(deckPromises).then( () => { return {decks, deckRevisions}; });
}

function getSlideAmount(deckIds){
    let slidesAmount = {};
    let slidesPromises = deckIds.map( (deckId) => 
        rp.get({
            uri: `${Microservices.deck.uri}/deck/${deckId}/slides`, 
            qs: {
                countOnly: true
            },
            json: true
        }).then((noOfSlides) => {
            slidesAmount[deckId] = noOfSlides.slidesCount;
        }).catch( (err) => {
            slidesAmount[deckId] = 0;
        }));

    return Promise.all(slidesPromises).then( () => { return slidesAmount; });
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

function getUserIds(docs, facets, selectedUserIds){
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

    // show selected users in facet, even its facet count is zero
    userIds.concat(selectedUserIds);

    return uniq(userIds);
}

function getLanguageFromCode(languageCode) {
    let language = languageCode === undefined ? '' : getLanguageName(languageCode);
    return (language === '' ? 'English' : language);
}   

function fillFacetsInfo(facets, usernames, tags) {
    facets.language.forEach( (item) => {
        item.text = getLanguageFromCode(item.val);
    });

    facets.creator.forEach( (item) => {
        let user = usernames[item.val];
        item.text = user.displayName || user.username;
        item.user = user;
    });

    facets.tags.forEach( (item) => {
        item.text = tags[item.val];
    });

    facets.topics.forEach( (item) => {
        item.text = tags[item.val];
    });

    facets.educationLevel.forEach( (item) => {
        item.text = getEducationLevel(item.val); 
    });
}

function getRequestOptions(params) {
    if (params.nextLink) {
        let { pathname, query } = url.parse(params.nextLink); 
        let qs = querystring.parse(query);

        if (qs.language) {
            qs.language = (qs.language instanceof Array) ? qs.language : [qs.language];
        }

        if (qs.user) {
            qs.user = (qs.user instanceof Array) ? qs.user : [qs.user];
        }

        if (qs.tag) {
            qs.tag = (qs.tag instanceof Array) ? qs.tag : [qs.tag];
        }

        return {
            uri: `${Microservices.search.uri}${pathname}`, 
            qs: qs,
            json: true,
            useQuerystring: true,
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
    if (!facets || (!facets.tags && !facets.topics)) {
        return Promise.resolve();
    }

    let tags = {};
    let tagsAndTopics = (facets.tags || []).concat(facets.topics || []);

    let tagPromises = tagsAndTopics.map( (facetTag) => 
        rp.get({uri: `${Microservices.tag.uri}/tag/${facetTag.val}`, json: true}).then( (tag) => {
            tags[tag.tagName] = tag.defaultName;
        }).catch( (err) => {
            tags[facetTag.val] = facetTag.val;
        }));

    return Promise.all(tagPromises).then( () => { return tags; });
}

function addToFacet(facetValues, selectedValues) {
    (selectedValues || []).forEach( (selected) => {
        let found = facetValues.find( (f) => {
            return f.val === selected;
        });

        if (!found) {
            facetValues.push({
                val: selected,
                count: 0, 
                rowCount: 0
            });
        }
    });
}

function addSelectedToFacets(facets, query) {
    addToFacet(facets.language, query.language);
    addToFacet(facets.creator, query.user);
    addToFacet(facets.tags, query.tag);
    addToFacet(facets.educationLevel, query.educationLevel);
    addToFacet(facets.topics, query.topics);
}

function getQuestionsCount(deckIdsSet) {
    let questionsCount = {};
    let questionsPromises = [];

    for(let deckId of deckIdsSet){
        let qPromise = rp.get({
            uri: `${Microservices.questions.uri}/deck/${deckId}/questions`,
            qs: {
                metaonly: true,
                include_subdecks_and_slides: true,
            },
            json: true,
        }).then( (response) => {
            questionsCount[deckId] = response.count;
        }).catch( (err) => {
            questionsCount[deckId] = 0;
        });
        questionsPromises.push(qPromise);
    }
    return Promise.all(questionsPromises).then( () => { return questionsCount; });
}

function getForks(deck) {
    let forks = [];
    forks = deck.translations.concat(deck.forks);
    deck.forks.forEach( (fork) => {
        if (!isEmpty(fork.translations)) {
            forks = forks.concat(fork.translations);
        }
    });

    return forks;
}

export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});

        if (resource === 'searchresults.list') {

            let options = getRequestOptions(params);

            // request search results from search service
            rp.get(options).then( (response) => {

                let deckIds = response.docs.map( (result) => result.db_id);

                if (response.facets) {

                    // add selected filters to facets with zero facet count
                    addSelectedToFacets(response.facets, options.qs);
                }

                let userIds = getUserIds(response.docs, response.facets, options.qs.user);

                Promise.all([ 
                    getUsers(userIds), 
                    getActivity('react', deckIds), 
                    getActivity('download', deckIds), 
                    getActivity('share', deckIds),
                    getTags(response.facets),
                    getSlideAmount(deckIds),
                    getQuestionsCount(deckIds),
                ]).then( ([ users, likes, downloads, shares, tags, slides, questions ]) => {
                    response.docs.forEach( (result) => {

                        // currently forks and translations are merged
                        // TODO: present them separately in the results
                        result.forks = getForks(result);

                        parseDeck(result, users);

                        // fill forks data
                        if (!isEmpty(result.forks)) {
                            result.forks.forEach( (fork) => parseDeck(fork, users));
                        }

                        //fill number of likes, downloads and shares
                        result.noOfLikes = likes[result.db_id];
                        result.downloadsCount = downloads[result.db_id];
                        result.sharesCount = shares[result.db_id];
                        result.questionsCount = questions[result.db_id];
                        result.noOfSlides = slides[result.db_id];
                    });

                    if (response.facets) {
                        fillFacetsInfo(response.facets, users, tags);
                    }

                    callback(null, {
                        numFound: response.numFound,
                        hasMore: response.hasMore,
                        links: response.links,
                        spellcheck: response.spellcheck,
                        facets: response.facets,
                        page: response.page,
                        request: options,
                        docs: response.docs
                    });
                }).catch(callback);

            }).catch(callback);
        } else if (resource === 'searchresults.prefixFacet') {
            let request = { ...params.request };

            if (params.facet_prefix_value !== '') {
                request.qs.facet_prefix_field = params.facet_prefix_field;
                request.qs.facet_prefix_value = params.facet_prefix_value;
            }

            rp.get(request).then( (response) => {
                if (params.facet_prefix_field === 'tag') {
                    getTags(response.facets).then( (tags) => {
                        fillFacetsInfo(response.facets, [], tags);
                        callback(null, {
                            facetName: 'tags', 
                            facets: response.facets.tags,
                        });
                    }).catch(callback);
                } else if (params.facet_prefix_field === 'user') {
                    let userIds = getUserIds([], response.facets, []);
                }
            }).catch(callback);
        }
    }
};
