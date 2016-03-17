import _ from 'lodash';

let now = Date.now();
const args = {
    sid: 0
};
const initialActivities = [
    {'id': 0, 'type': 'add', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Ali K.', 'userID': 23, 'date': timeFromNow(now,2,0), 'likesNo': 4},
    {'id': 1, 'type': 'edit', 'contentType': 'deck', 'contentID': 53 + parseInt(args.sid), contentName: 'SlideWiki Introduction', 'username': 'Dara T.', 'userID': 13, 'date': timeFromNow(now,1,0), 'likesNo': 1},
    {'id': 2, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,45), 'likesNo': 2, 'translation': {'contentID':42, 'language':'Serbian'}},
    {'id': 3, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,30), 'likesNo': 2, 'translation': {'contentID':42, 'language':'Bosnian'}},
    {'id': 4, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,15), 'likesNo': 2, 'translation': {'contentID':42, 'language':'Croatian'}},
    {'id': 5, 'type': 'share', 'contentType': 'deck', 'contentID': 53 + parseInt(args.sid), contentName: 'SlideWiki Introduction', 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,7), 'likesNo': 10, 'shareInfo': {'postURI':'http://facebook.com', 'platform':'Facebook'}},
    {'id': 6, 'type': 'comment', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,6), 'likesNo': 3, commentID: 42, commentText: 'Awesome!'},
    {'id': 7, 'type': 'reply', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Ali K.', 'userID': 23, 'date': timeFromNow(now,0,5), 'likesNo': 3, replyID: 43, replyText: 'Indeed', commentID: 42},
    {id: 8, type: 'use', contentType: 'slide', contentID: 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', username: 'Vuk M.', userID: 7, date: timeFromNow(now,0,4), likesNo: 2, targetDeckID: 53 + parseInt(args.sid), targetDeckName: 'SlideWiki Introduction'},
    {id: 9, type: 'like', contentType: 'slide', contentID: 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', username: 'Vuk M.', userID: 7, date: timeFromNow(now,0,3), likesNo: 2},
    {id: 10, type: 'download', contentType: 'slide', contentID: 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', username: 'Vuk M.', userID: 7, date: timeFromNow(now,0,2), likesNo: 2}
];
function timeFromNow(now, hours, mins) {
    return now - 60000*mins - 3600000*hours;
}
function getRandomActivity() {
    return _.merge({}, initialActivities[Math.floor(Math.random()*1000) % 11]);
}
function generateRandomActivities(numActivities, startID) {
    const now = Date.now();
    let activities = [];
    for (let i=0; i<numActivities; i++) {
        let a = getRandomActivity();
        a.id = i+startID;
        a.date = timeFromNow(now, 0, 1);
        a.contentName = a.contentName + ' (random)';
        activities.push(a);
    }
    return activities;
}

export default {
    name: 'activities',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};
        switch (resource) {
            case 'activities.list':
                /*********connect to microservices*************/
                //todo
                /*********received data from microservices*************/
                callback(null, {activities: initialActivities.concat(generateRandomActivities(30, 11)), selector: selector, hasMore: true});
                break;
            case 'activities.more':
                /*********connect to microservices*************/
                //todo
                /*********received data from microservices*************/
                if (!params.newActivities) break;
                setTimeout(() => {
                    let hasMoreActivities = true;
                    let newActivities = [];
                    const startID = params.newActivities.latestId+1;
                    if (startID < 200) newActivities = generateRandomActivities(params.newActivities.numNew, startID);
                    if (startID + params.newActivities.numNew > 200) hasMoreActivities = false;
                    callback(null, {activities: newActivities, hasMore: hasMoreActivities});
                }, 500);
                break;
        }
    },
    update: (req, resource, params, body, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'activities.like'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            callback(null, {id: args.id});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
