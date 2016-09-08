// import _ from 'lodash';
import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

// let now = Date.now();
// const args = {
//     sid: 0
// };
// const initialActivities = [
//     {'id': 0, 'type': 'add', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Ali K.', 'userID': 23, 'date': timeFromNow(now,2,0), 'likesNo': 4},
//     {'id': 1, 'type': 'edit', 'contentType': 'deck', 'contentID': 53 + parseInt(args.sid), contentName: 'SlideWiki Introduction', 'username': 'Dara T.', 'userID': 13, 'date': timeFromNow(now,1,0), 'likesNo': 1},
//     {'id': 2, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,45), 'likesNo': 2, 'translation': {'contentID':42, 'language':'Serbian'}},
//     {'id': 3, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,30), 'likesNo': 2, 'translation': {'contentID':42, 'language':'Bosnian'}},
//     {'id': 4, 'type': 'translate', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,15), 'likesNo': 2, 'translation': {'contentID':42, 'language':'Croatian'}},
//     {'id': 5, 'type': 'share', 'contentType': 'deck', 'contentID': 53 + parseInt(args.sid), contentName: 'SlideWiki Introduction', 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,7), 'likesNo': 10, 'shareInfo': {'postURI':'http://facebook.com', 'platform':'Facebook'}},
//     {'id': 6, 'type': 'comment', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Vuk M.', 'userID': 7, 'date': timeFromNow(now,0,6), 'likesNo': 3, commentID: 42, commentText: 'Awesome!'},
//     {'id': 7, 'type': 'reply', 'contentType': 'slide', 'contentID': 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', 'username': 'Ali K.', 'userID': 23, 'date': timeFromNow(now,0,5), 'likesNo': 3, replyID: 43, replyText: 'Indeed', commentID: 42},
//     {id: 8, type: 'use', contentType: 'slide', contentID: 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', username: 'Vuk M.', userID: 7, date: timeFromNow(now,0,4), likesNo: 2, targetDeckID: 53 + parseInt(args.sid), targetDeckName: 'SlideWiki Introduction'},
//     {id: 9, type: 'like', contentType: 'slide', contentID: 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', username: 'Vuk M.', userID: 7, date: timeFromNow(now,0,3), likesNo: 2},
//     {id: 10, type: 'download', contentType: 'slide', contentID: 67 + parseInt(args.sid), contentName: 'SlideWiki Technologies', username: 'Vuk M.', userID: 7, date: timeFromNow(now,0,2), likesNo: 2}
// ];
// function timeFromNow(now, hours, mins) {
//     return now - 60000*mins - 3600000*hours;
// }
// function getRandomActivity() {
//     return _.merge({}, initialActivities[Math.floor(Math.random()*1000) % 11]);
// }
// function generateRandomActivities(numActivities, startID) {
//     const now = Date.now();
//     let activities = [];
//     for (let i=0; i<numActivities; i++) {
//         let a = getRandomActivity();
//         a.id = i+startID;
//         a.date = timeFromNow(now, 0, 1);
//         a.contentName = a.contentName + ' (random)';
//         activities.push(a);
//     }
//     return activities;
// }

function adjustIDs(activity) {
    activity.content_id = adjustID(activity.content_id);
    activity.user_id = adjustID(activity.user_id);
    if (activity.translation_info !== undefined)
        activity.translation_info.content_id = adjustID(activity.translation_info.content_id);
    if (activity.comment_info !== undefined)
        activity.comment_info.comment_id = adjustID(activity.comment_info.comment_id);
    if (activity.use_info !== undefined)
        activity.use_info.target_id = adjustID(activity.use_info.target_id);
}
function adjustID(id) {
    if (id.length === 24 && id.startsWith('1122334455')) {
        return id.substring(20).replace(/^0+/, '');
    }
    return id;
}

export default {
    name: 'activities',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': args.id, 'spath': args.spath, 'sid': args.sid, 'stype': args.stype, 'mode': args.mode};

        // const content_id = (!selector.sid.startsWith('1122334455')) ? ('112233445566778899000000'.substring(0, 24 - selector.sid.length) + selector.sid) : selector.sid;//TODO solve these ID issues
        const content_id = selector.sid;
        switch (resource) {
            case 'activities.list':

                // callback(null, {activities: initialActivities.concat(generateRandomActivities(30, 11)), selector: selector, hasMore: true});

                rp.get({uri: Microservices.activities.uri + '/activities/' + content_id + '/more/0/30' }).then((res) => {
                    let activities = JSON.parse(res);

                    activities.forEach((activity) => adjustIDs(activity));//TODO solve these ID issues

                    callback(null, {activities: activities, selector: selector, hasMore: (activities.length === 30)});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {activities: {}, selector: selector, hasMore: false});
                });

                break;
            case 'activities.more':

                if (!params.newActivities) break;
                // setTimeout(() => {
                //     let hasMoreActivities = true;
                //     let newActivities = [];
                //     const startID = params.newActivities.latestId+1;
                //     if (startID < 200) newActivities = generateRandomActivities(params.newActivities.numNew, startID);
                //     if (startID + params.newActivities.numNew > 200) hasMoreActivities = false;
                //     callback(null, {activities: newActivities, hasMore: hasMoreActivities});
                // }, 500);

                rp.get({uri: Microservices.activities.uri + '/activities/' + content_id + '/more/' + params.newActivities.start + '/' + params.newActivities.numNew }).then((res) => {
                    let activities = JSON.parse(res);

                    activities.forEach((activity) => adjustIDs(activity));//TODO solve these ID issues

                    callback(null, {activities: activities, selector: selector, hasMore: (activities.length === 30)});
                }).catch((err) => {
                    console.log(err);
                    callback(null, {activities: {}, selector: selector, hasMore: false});
                });

                break;
        }
    },
    //Not used
    create: (req, resource, params, body, config, callback) => {
        //TODO get real user id and content name
        const randomUserId = '11223344556677889900000' + String(1 + Math.round(Math.random() * 5));

        let args = params.params? params.params : params;
        let selector= args.selector;

        if(resource === 'activity.comment'){
            // const content_id = (!selector.sid.startsWith('1122334455')) ? ('112233445566778899000000'.substring(0, 24 - selector.sid.length) + selector.sid) : selector.sid;
            const content_id = selector.sid;
            rp.post({
                uri: Microservices.activities.uri + '/activity/new',
                body:JSON.stringify({
                    comment_info: {
                        comment_id: '...',
                        text: args.title
                    },
                    activity_type: 'comment',
                    user_id: randomUserId,
                    content_id: content_id,
                    content_kind: selector.stype,
                    content_name: args.content_name
                })
            }).then((res) => {
                callback(null, {activity: JSON.parse(res), selector: args.selector});
            }).catch((err) => {
                console.log(err);
                callback(null, {activity: {}, selector: args.selector});
            });
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
