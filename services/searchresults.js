import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import customDate from '../components/Deck/util/CustomDate';

function extractSpellcheckSuggestion(spellcheck){

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

export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;

        if(resource === 'searchresults.list'){

            // fetch results from search-microservice
            rp.get({uri: Microservices.search.uri + '/search?' + args.queryparams}).then((results) => {

                // console.log(JSON.stringify(JSON.parse(results), null, 2));

                let searchResults = JSON.parse(results);
                let allPromises = [], decks = {}, decksIdHash = {}, deckRevisions = {};
                let userPromises = [], usernames = {}, userIdHash = {};

                searchResults.response.docs.forEach( (res) => {

                    // keep user id to request later
                    if(res.creator !== null){
                        userIdHash[res.creator] = true;
                    }

                    // transform results to return to frontend
                    if(res.kind === 'deck'){
                        res.link = '/deck/' + res.db_id + '-' + res.db_revision_id;
                        res.kind = 'Deck';
                        res.title = (res.title && res.title.length > 70) ? res.title.substring(0,70)+'...' : res.title;
                        res.description = (res.description && res.description.length > 85) ? res.description.substring(0,85)+'...' : res.description;
                        res.lastUpdate = customDate.format(res.lastUpdate, 'Do MMMM YYYY');
                        res.user = {
                            id: res.creator,
                            username: '',
                            link: ''
                        };

                        //keep deck id to request later
                        decksIdHash[res.db_id] = true;
                    }
                    else if(res.kind === 'slide'){
                        res.deck = {
                            id: res.usage[0],
                            title: '',
                            link: ''
                        };
                        res.link = '/deck/' + res.usage[0] + '/slide/' + res.db_id + '-' + res.db_revision_id;
                        res.kind = 'Slide';
                        res.title = (res.title && res.title.length > 70) ? res.title.substring(0,70)+'...' : res.title;
                        res.description = (res.content && res.content.length > 85) ? res.content.substring(0,85)+'...' : res.content;
                        res.lastUpdate = customDate.format(res.lastUpdate, 'Do MMMM YYYY');
                        res.user = {
                            id: res.creator,
                            username: '',
                            link: ''
                        };

                        // keep more deck ids to request later
                        res.usage.forEach( (deckRev) => {
                            let deckId = deckRev.split('-')[0];
                            decksIdHash[deckId] = true;
                        });
                    }

                });

                // request usernames of user ids found
                for(let userId in userIdHash){
                    allPromises.push(rp.get({uri: Microservices.user.uri + '/user/' + userId}).then((userRes) => {
                        usernames[userId] = JSON.parse(userRes).username;
                        return Promise.resolve(userRes);
                    }).catch( (err) => {
                        usernames[userId] = 'Unknown user';
                        return Promise.resolve(err);
                    }));
                }

                // request decks of deck ids found
                for(let deckId in decksIdHash){
                    allPromises.push(rp.get({uri: Microservices.deck.uri + '/deck/' + deckId}).then( (deckRes) => {
                        decks[deckId] = JSON.parse(deckRes);
                        decks[deckId].revisions.forEach( (rev) => {
                            deckRevisions[deckId + '-' + rev.id] = rev;
                        });

                        return Promise.resolve(deckRes);
                    }).catch( (err) => {
                        decks[deckId] = null;
                        return Promise.resolve(err);
                    }));
                }

                Promise.all(allPromises).then( () => {
                    searchResults.response.docs.forEach( (returnItem) => {
                        // console.log(returnItem);
                        // fill extra user info
                        returnItem.user.username = usernames[returnItem.user.id];
                        returnItem.user.link = '/user/' + returnItem.user.username;

                        if(returnItem.kind === 'Deck'){

                            // fill deck subitems (revisions of the deck)
                            returnItem.subItems = decks[returnItem.db_id].revisions.filter( (rev) => {
                                // do not contain revision presented in result title
                                return (rev.id !== returnItem.db_revision_id);
                            }).map( (rev) => {
                                return {
                                    id: rev.id,
                                    title: rev.title,
                                    link: '/deck/' + returnItem.id + '-' + rev.id
                                };
                            }).reverse();
                        }
                        else if(returnItem.kind === 'Slide'){
                            returnItem.subItems = returnItem.usage.filter( (usageItem) => {
                                // do not contain usage presented in result title
                                return (returnItem.deck.id !== usageItem);
                            }).map( (usageItem) => {
                                return {
                                    id: usageItem,
                                    title: deckRevisions[usageItem].title,
                                    link: '/deck/' + usageItem + '/slide/' + returnItem.id + '-' + returnItem.revisionId
                                };
                            });

                            // fill deck info
                            returnItem.deck.title = deckRevisions[returnItem.deck.id].title;
                            returnItem.deck.link = '/deck/' + returnItem.deck.id;
                        }
                    });

                    // console.log(JSON.stringify(returnData, null, 2));
                    // console.log(JSON.stringify(searchResults.spellcheck));

                    callback(null, {
                        numFound: searchResults.response.docs.length,
                        docs: searchResults.response.docs,
                        spellcheck: extractSpellcheckSuggestion(searchResults.spellcheck)
                    });
                });

            }).catch((error) => {
                callback(error);
            });

        }
    }
};
