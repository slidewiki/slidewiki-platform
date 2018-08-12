import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import moment from 'moment';

const fillMissingDates = (results) => {
    let minDate = null;
    let today = moment().utc().endOf('day');

    results.forEach((result) => {
        const resultDate = moment(result._id);
        minDate = minDate ? moment.min(minDate, resultDate) : resultDate;
    });

    if (!minDate && !today) {
        return results;
    }

    const dateDiff = today.diff(minDate, 'days');
    let newResults = [];
    for (let i = 0; i < dateDiff; i++) {
        let date = minDate.clone().add(i, 'day');
        let found = results.find((result) => {
            return date.isSame(result._id, 'day');
        });

        newResults.push({date: date.valueOf(), value: found != null ? found.count : 0});
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
        let fromDate = periodToDate(args.datePeriod);
        let username = args.username;

        if (resource === 'stats.userActivitiesByTime') {
            let pipeline = [{
                '$match': {
                    'timestamp': {'$gte': {'$dte': fromDate.toISOString()}},
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
            }).then((response) => callback(null, fillMissingDates(response)))
              .catch((err) => callback(err));
        } else if (resource === 'stats.userActivitiesByCategory') {
            let pipeline = [
                {
                    '$match ': {
                        'timestamp ': {
                            '$gte ': {
                                '$dte ': fromDate.toISOString()
                            }
                        }
                    }
                },
                {
                    '$match ': {
                        'statement.verb ': {
                            '$exists ': true
                        }
                    }
                },
                {
                    '$project ': {
                        'verb ': '$statement.verb.id '
                    }
                },
                {
                    '$group ': {
                        '_id ': '$verb ',
                        'value ': {
                            '$sum ': 1
                        }
                    }
                }, {
                    '$project ': {
                        '_id ': false,
                        'category ': '$_id ',
                        'value ': true
                    }
                }, {
                    '$sort ': {
                        'count ': -1
                    }
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
