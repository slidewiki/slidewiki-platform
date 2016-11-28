import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import customDate from '../components/Deck/util/CustomDate';

export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;

        if(resource === 'searchresults.list'){

            // fetch results from search-microservice
            rp.get({uri: Microservices.search.uri + '/get/' + args.queryparams}).then((results) => {
                let searchResults = JSON.parse(results);
                let allPromises = [], decks = {}, decksIdHash = {}, deckRevisions = {};
                let userPromises = [], usernames = {}, userIdHash = {};
                let returnData = [];

                searchResults.docs.forEach( (res) => {
                    // console.log(res);
                    let firstRevision = res.revisions.docs[0];

                    // mark users to request
                    if(firstRevision.user !== null){
                        userIdHash[parseInt(firstRevision.user)] = true;
                    }

                    //
                    if(res.kind === 'deck'){
                        // console.log(firstRevision);
                        returnData.push({
                            id: res._id,
                            revisionId: firstRevision.id,
                            link: '/deck/' + res._id + '-' + firstRevision.id,
                            kind: 'deck',
                            title: firstRevision.title,
                            description: res.description,
                            lastModified: customDate.format(firstRevision.timestamp, 'Do MMMM YYYY'),
                            user: firstRevision.user
                        });

                        //mark decks to request
                        decksIdHash[parseInt(res._id)] = true;
                    }
                    else if(res.kind === 'slide'){
                        returnData.push({
                            id: res._id,
                            revisionId: firstRevision.id,
                            link: '/deck/' + firstRevision.usage[0] + '/slide/' + res._id + '-' + firstRevision.id,
                            kind: 'slide',
                            title: firstRevision.title,
                            description: firstRevision.content,
                            lastModified: customDate.format(firstRevision.timestamp, 'Do MMMM YYYY'),
                            user: firstRevision.user,
                            usage: firstRevision.usage
                        });

                        // mark more decks
                        firstRevision.usage.forEach( (deckRev) => {
                            let deckId = deckRev.split('-')[0];
                            decksIdHash[parseInt(deckId)] = true;
                        });
                    }

                });

                // get usernames from user ids found
                for(let userId in userIdHash){
                    // console.log(userId);
                    allPromises.push(rp.get({uri: Microservices.user.uri + '/user/' + userId}).then((userRes) => {
                        usernames[userId] = JSON.parse(userRes).username;
                        return Promise.resolve(userRes);
                    }).catch( (err) => {
                        usernames[userId] = 'Unknown user';
                        return Promise.resolve(err);
                    }));
                }

                // get decks
                for(let deckId in decksIdHash){
                    allPromises.push(rp.get({uri: Microservices.deck.uri + '/deck/' + deckId}).then( (deckRes) => {
                        decks[deckId] = JSON.parse(deckRes);
                        decks[deckId].revisions.forEach( (rev) => {
                            deckRevisions[deckId + '-' + rev.id] = rev;
                        });

                        return Promise.resolve(deckRes);
                    }).catch( (err) => {
                        // console.log(res._id + ' error');
                        decks[deckId] = null;
                        return Promise.resolve(err);
                    }));
                }

                Promise.all(allPromises).then( () => {
                    // console.log(decks);
                    // console.log(deckRevisions);
                    returnData.forEach( (returnItem) => {
                        returnItem.user = usernames[returnItem.user];
                        if(returnItem.kind === 'deck'){
                            returnItem.subItems = decks[returnItem.id].revisions.map( (rev) => {
                                return {
                                    id: rev.id,
                                    title: rev.title,
                                    link: returnItem.id + '-' + rev.id
                                };
                            }).reverse();
                        }
                        else if(returnItem.kind === 'slide'){
                            let deckUsage = [];
                            returnItem.usage.forEach( (usageItem) => {
                                deckUsage.push({
                                    id: usageItem,
                                    title: deckRevisions[usageItem].title,
                                    link: '/deck/' + usageItem + '/slide/' + returnItem.id + '-' + returnItem.revisionId
                                });
                            });
                            returnItem.subItems = deckUsage;
                            // console.log(deckUsage);
                        }

                    });
                    console.log(JSON.stringify(returnData, null, 2));
                });




                callback(null, {
                    numFound: searchResults.numFound,
                    docs: searchResults.docs
                });

            }).catch((error) => {
                // console.log(error);
                callback(error);
            });

        }
    }
};
