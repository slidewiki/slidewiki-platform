import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import moment from 'moment';

const fillMissingDates = (fromDate, results) => {
    const dateDiff = moment().utc().endOf('day').diff(fromDate, 'days');
    let newResults = [];

    for (let i = 0; i < dateDiff; i++) {
        let date = fromDate.clone().add(i, 'day');
        let found = results.find((result) => {
            return date.isSame(result._id, 'day');
        });
        newResults.push({date: date.valueOf(), count: found != null ? found.count : 0});
    }
    return newResults;
};

const periodToDate = (datePeriod) => {
    const today = moment().utc().endOf('day');

    switch (datePeriod) {
        case 'LAST_30_DAYS':
            return today.subtract(30, 'days');
        case 'LAST_2_MONTHS':
            return today.subtract(2, 'months');
        case 'LAST_6_MONTHS':
            return today.subtract(6, 'months');
        case 'LAST_1_YEAR':
            return today.subtract(1, 'years');
        case 'LAST_2_YEARS':
            return today.subtract(2, 'years');
        case 'LAST_7_DAYS':
        default:
            return today.subtract(7, 'days');
    }
};

const activityTypeToVerb = (activityType) => {
    switch (activityType) {
        case 'edit':
            return 'https://w3id.org/xapi/acrossx/verbs/edited';
        case 'like':
            return 'https://w3id.org/xapi/acrossx/verbs/liked';
        default:
            return 'http://adlnet.gov/expapi/verbs/experienced';
    }
};

export default {
    name: 'stats',
    read: (req, resource, params, config, callback) => {
        let args = params.params ? params.params : params;
        let {username, activityType, datePeriod, groupid} = args;

        if (resource === 'stats.userStatsByTime') {
            let fromDate = periodToDate(datePeriod);
            let pipeline = [{
                '$match': {
                    'timestamp': {'$gte': {'$dte': fromDate.toISOString()}},
                    'statement.verb.id': activityTypeToVerb(activityType),
                    'statement.actor.account.name': username
                }
            }, {
                '$project': {
                    'date': {
                        '$dateToString': {
                            'format': '%Y-%m-%d',
                            'date': '$timestamp'
                        }
                    }
                }
            }, {
                '$group': {
                    '_id': '$date',
                    'count': {
                        '$sum': 1
                    }
                }
            }, {
                '$sort': {
                    '_id': 1
                }
            }];
            rp({
                method: 'GET',
                uri: Microservices.lrs.uri + '/statements/aggregate',
                qs: {
                    pipeline: JSON.stringify(pipeline),
                },
                headers: {'Authorization': 'Basic ' + Microservices.lrs.basicAuth},
                json: true
            }).then((response) => callback(null, fillMissingDates(fromDate, response)))
              .catch((err) => callback(err));
        } else if (resource === 'stats.groupStatsByTime') {
            let fromDate = periodToDate(datePeriod);
            rp.post({
                uri: Microservices.user.uri + '/usergroups',
                body: [parseInt(params.groupid)],
                json: true
            }).then((res) => {
                let memberUsernames = res[0].members.map((member) => member.username);
                memberUsernames.push(res[0].creator.username);
                let pipeline = [{
                    '$match': {
                        'timestamp': {'$gte': {'$dte': fromDate.toISOString()}},
                        'statement.verb.id': activityTypeToVerb(activityType),
                        'statement.actor.account.name': { $in: memberUsernames }
                    }
                }, {
                    '$project': {
                        'date': {
                            '$dateToString': {
                                'format': '%Y-%m-%d',
                                'date': '$timestamp'
                            }
                        }
                    }
                }, {
                    '$group': {
                        '_id': '$date',
                        'count': {
                            '$sum': 1
                        }
                    }
                }, {
                    '$sort': {
                        '_id': 1
                    }
                }];
                return rp({
                    method: 'GET',
                    uri: Microservices.lrs.uri + '/statements/aggregate',
                    qs: {
                        pipeline: JSON.stringify(pipeline),
                    },
                    headers: {'Authorization': 'Basic ' + Microservices.lrs.basicAuth},
                    json: true
                });
            }).then((response) => callback(null, fillMissingDates(fromDate, response)))
              .catch((err) => callback(err));
        } else if (resource === 'stats.userStatsByTag') {
            let pipeline = [
                {
                    '$match': {
                        'statement.context.contextActivities.category': {
                            '$exists': true
                        },
                        'statement.actor.account.name': username
                    }
                },
                {
                    '$unwind': {
                        'path': '$statement.context.contextActivities.category'
                    }
                },
                {
                    '$project': {
                        'tag': '$statement.context.contextActivities.category.definition.name.en'
                    }
                },
                {
                    '$group': {
                        '_id': '$tag',
                        'count': {
                            '$sum': 1
                        }
                    }
                },
                {
                    '$project': {
                        '_id': false,
                        'value': '$_id',
                        'count': true
                    }
                },
                {
                    '$sort': {
                        'count': -1
                    }
                },
                {
                    '$limit': 30
                }
            ];
            rp({
                method: 'GET',
                uri: Microservices.lrs.uri + '/statements/aggregate',
                qs: {
                    pipeline: JSON.stringify(pipeline),
                },
                headers: {'Authorization': 'Basic ' + Microservices.lrs.basicAuth},
                json: true
            }).then((response) => callback(null, response))
              .catch((err) => callback(err));
        } else if (resource === 'stats.userEngagement') {

            let promises = [];
            let pipeline_active_engagement = [
                {
                    "$match": {
                        "statement.verb.id": {
                            "$in": [
                                "https://w3id.org/xapi/acrossx/verbs/edited",
                                "http://activitystrea.ms/schema/1.0/create",
                                "https://w3id.org/xapi/acrossx/verbs/forked",
                                "https://brindlewaye.com/xAPITerms/verbs/added"
                            ]
                        },
                        "statement.actor.account.name": username
                    }
                },
                {
                    "$project": {
                        "user": "$statement.actor.account.name"
                    }
                },
                {
                    "$group": {
                        "_id": "$user",
                        "count": {
                            "$sum": 1
                        }
                    }
                },
                {
                    "$project": {
                        "_id": false,
                        "value": "$_id",
                        "count": true
                    }
                },
                {
                    "$sort": {
                        "count": -1
                    }
                },
                {
                    "$limit": 1
                }
            ];

            let pipeline_passive_engagement = [
                {
                    "$match": {
                        "statement.verb.id": {
                            "$in": [
                                "http://adlnet.gov/expapi/verbs/experienced",
                                "https://w3id.org/xapi/acrossx/verbs/liked",
                                "https://w3id.org/xapi/acrossx/verbs/downloaded"
                            ]
                        },
                        "statement.actor.account.name": username
                    }
                },
                {
                    "$project": {
                        "user": "$statement.actor.account.name"
                    }
                },
                {
                    "$group": {
                        "_id": "$user",
                        "count": {
                            "$sum": 1
                        }
                    }
                },
                {
                    "$project": {
                        "_id": false,
                        "value": "$_id",
                        "count": true
                    }
                },
                {
                    "$sort": {
                        "count": -1
                    }
                },
                {
                    "$limit": 1
                }
            ];

            let pipeline_social_engagement = [
                {
                    "$match": {
                        "statement.verb.id": {
                            "$in": [
                                "https://w3id.org/xapi/acrossx/verbs/shared",
                                "http://adlnet.gov/expapi/verbs/commented",
                                "https://w3id.org/xapi/acrossx/verbs/replied"
                            ]
                        },
                        "statement.actor.account.name": username
                    }
                },
                {
                    "$project": {
                        "user": "$statement.actor.account.name"
                    }
                },
                {
                    "$group": {
                        "_id": "$user",
                        "count": {
                            "$sum": 1
                        }
                    }
                },
                {
                    "$project": {
                        "_id": false,
                        "value": "$_id",
                        "count": true
                    }
                },
                {
                    "$sort": {
                        "count": -1
                    }
                },
                {
                    "$limit": 1
                }
            ];

            promises.push(rp({
                method: 'GET',
                uri: Microservices.lrs.uri + '/statements/aggregate',
                qs: {
                    pipeline: JSON.stringify(pipeline_active_engagement),
                },
                headers: {'Authorization': 'Basic ' + Microservices.lrs.basicAuth},
                json: true
            }).then((response) => {
                return {"active_engagement" : response[0].count};
            })
              .catch((err) => callback(err))
            );

            promises.push(rp({
                method: 'GET',
                uri: Microservices.lrs.uri + '/statements/aggregate',
                qs: {
                    pipeline: JSON.stringify(pipeline_passive_engagement),
                },
                headers: {'Authorization': 'Basic ' + Microservices.lrs.basicAuth},
                json: true
            }).then((response) => {
                return {"passive_engagement" : response[0].count};
            })
              .catch((err) => callback(err))
            );

            promises.push(rp({
                method: 'GET',
                uri: Microservices.lrs.uri + '/statements/aggregate',
                qs: {
                    pipeline: JSON.stringify(pipeline_social_engagement),
                },
                headers: {'Authorization': 'Basic ' + Microservices.lrs.basicAuth},
                json: true
            }).then((response) => {
                return {"social_engagement" : response[0].count};
            })
              .catch((err) => callback(err))
            );
            Promise.all(promises).then(function(values) {
                  // console.log("all", values);
                  let toReturn = [];
                  values.forEach(function(value){
                    if(value)
                        toReturn.push(value);
                        //console.log("all", value);

                  });
                  callback(null, toReturn);
                });  
            
        } else if (resource === 'stats.groupMembersStats') {
            let memberUsernames;
            rp.post({
                uri: Microservices.user.uri + '/usergroups',
                body: [parseInt(params.groupid)],
                json: true
            }).then((res) => {
                memberUsernames = res[0].members.map((member) => member.username);
                memberUsernames.push(res[0].creator.username);
                let pipeline = [
                    {
                        '$match': {
                            'timestamp': {'$gte': {'$dte': periodToDate(datePeriod).toISOString()}},
                            'statement.verb.id': activityTypeToVerb(activityType),
                            'statement.actor.account.name': { $in: memberUsernames }
                        }
                    },
                    {
                        '$project': {
                            'username': '$statement.actor.account.name'
                        }
                    },
                    {
                        '$group': {
                            '_id': '$username',
                            'count': {
                                '$sum': 1
                            }
                        }
                    },
                    {
                        '$project': {
                            '_id': false,
                            'username': '$_id',
                            'count': true
                        }
                    },
                    {
                        '$sort': {
                            'count': -1
                        }
                    },
                    {
                        '$limit': 30
                    }
                ];

                return rp({
                    method: 'GET',
                    uri: Microservices.lrs.uri + '/statements/aggregate',
                    qs: {
                        pipeline: JSON.stringify(pipeline),
                    },
                    headers: {'Authorization': 'Basic ' + Microservices.lrs.basicAuth},
                    json: true
                });
            }).then((response) => {
                let memberStats = memberUsernames.map((username) => {
                    let found = response.find((stat) => {
                        return stat.username === username;
                    });
                    return {username: username, count: found != null ? found.count : 0};
                }).sort((a, b) => b.count - a.count);
                callback(null, callback(null, memberStats));
            }).catch((err) => callback(err));
        }
    }
};
