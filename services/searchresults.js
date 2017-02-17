import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import customDate from '../components/Deck/util/CustomDate';

export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;

        if(resource === 'searchresults.list'){

            console.log('edw ' + JSON.stringify(args));

            // fetch results from search-microservice
            rp.get({uri: Microservices.search.uri + '/search?' + args.queryparams}).then((results) => {

                console.log(JSON.stringify(JSON.parse(results), null, 2));

                let searchResults = JSON.parse(results);
                let allPromises = [], decks = {}, decksIdHash = {}, deckRevisions = {};
                let userPromises = [], usernames = {}, userIdHash = {};
                let returnData = [];

                searchResults.docs.forEach( (res) => {

                    // revision to show in result title
                    let firstRevision = res.revisions.docs[0];

                    // keep user id to request later
                    if(firstRevision.user !== null){
                        userIdHash[parseInt(firstRevision.user)] = true;
                    }

                    // transform results to return to frontend
                    if(res.kind === 'deck'){
                        returnData.push({
                            id: parseInt(res._id),
                            revisionId: parseInt(firstRevision.id),
                            link: '/deck/' + res._id + '-' + firstRevision.id,
                            kind: 'Deck',
                            title: firstRevision.title,
                            description: (res.description && res.description.length > 85) ? res.description.substring(0,85)+'...' : res.description,
                            lastModified: customDate.format(res.lastUpdate, 'Do MMMM YYYY'),
                            user: {
                                id: firstRevision.user,
                                username: '',
                                link: ''
                            }
                        });

                        //keep deck id to request later
                        decksIdHash[parseInt(res._id)] = true;
                    }
                    else if(res.kind === 'slide'){
                        returnData.push({
                            id: parseInt(res._id),
                            revisionId: parseInt(firstRevision.id),
                            deck: {
                                id: firstRevision.usage[0],
                                title: '',
                                link: ''
                            },
                            link: '/deck/' + firstRevision.usage[0] + '/slide/' + res._id + '-' + firstRevision.id,
                            kind: 'Slide',
                            title: firstRevision.title,
                            description: (firstRevision.content && firstRevision.content.length > 85) ? firstRevision.content.substring(0,85)+'...' : firstRevision.content,
                            lastModified: customDate.format(res.lastUpdate, 'Do MMMM YYYY'),
                            user: {
                                id: firstRevision.user,
                                username: '',
                                link: '',
                            },
                            usage: firstRevision.usage
                        });

                        // keep more deck ids to request later
                        firstRevision.usage.forEach( (deckRev) => {
                            let deckId = deckRev.split('-')[0];
                            decksIdHash[parseInt(deckId)] = true;
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

                    returnData.forEach( (returnItem) => {

                        // fill extra user info
                        returnItem.user.username = usernames[returnItem.user.id];
                        returnItem.user.link = '/user/' + returnItem.user.username;

                        if(returnItem.kind === 'Deck'){

                            // fill deck subitems (revisions of the deck)
                            returnItem.subItems = decks[returnItem.id].revisions.filter( (rev) => {
                                // do not contain revision presented in result title
                                return (rev.id !== returnItem.revisionId);
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
                    callback(null, {
                        numFound: returnData.length,
                        docs: returnData
                    });
                });

            }).catch((error) => {
                // console.log(error);
                callback(error);
            });

        }
    }
};
