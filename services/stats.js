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

export default {
    name: 'stats',
    read: (req, resource, params, config, callback) => {
        let args = params.params ? params.params : params;
        let {username, activityType, datePeriod} = args;

        if (resource === 'stats.userStatsByTime') {
            let fromDate = periodToDate(datePeriod);
            let verbId;
            switch (activityType) {
                case 'edit':
                    verbId = 'https://w3id.org/xapi/acrossx/verbs/edited';
                    break;
                case 'like':
                    verbId = 'https://w3id.org/xapi/acrossx/verbs/liked';
                    break;
                case 'view':
                    verbId = 'http://adlnet.gov/expapi/verbs/experienced';
                    break;
                default:
                    callback(null, []);
            }

            let pipeline = [{
                '$match': {
                    'timestamp': {'$gte': {'$dte': fromDate.toISOString()}},
                    'statement.verb.id': verbId,
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
                uri: Microservices.lrs.uri + '/api/statements/aggregate',
                qs: {
                    pipeline: JSON.stringify(pipeline),
                },
                headers: {'Authorization': 'Basic ' + Microservices.lrs.basicAuth},
                json: true
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
                uri: Microservices.lrs.uri + '/api/statements/aggregate',
                qs: {
                    pipeline: JSON.stringify(pipeline),
                },
                headers: {'Authorization': 'Basic ' + Microservices.lrs.basicAuth},
                json: true
            }).then((response) => callback(null, response))
              .catch((err) => callback(err));
        }
    }
};
