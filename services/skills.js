import {Microservices} from '../configs/microservices';
import rp from 'request-promise';
import moment from 'moment';

export default {
    name: 'skills',
    read: (req, resource, params, config, callback) => {
        let args = params.params ? params.params : params;
        let {username, activityType, datePeriod} = args;

        if (resource === 'skills.userSkillsByTag') {
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
            }).then((response) => { 
            	let answers = [];
            	let promises = response.map( value => rp({
		                method: 'GET',
		                uri: 'http://slidewiki.imis.athena-innovation.gr:8983/solr/swikskills/select?q='+value.value,		                
		                json: true
		            }).then((response2) => {		            
		            if(typeof response2.response.numFound !== "0"){		            	
		            	return response2.response.docs[0].preferredLabel;
		            }        			            							
					else
						return "empty";
		            }).catch((err) => {}));           	
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
            })
              .catch((err) => callback(err)); //
        }
    }
};
