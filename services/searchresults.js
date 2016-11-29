import {Microservices} from '../configs/microservices';
const request = require('request');

function getUriParams(qstr){
    let query = {};
    let a = qstr.split('&');
    for (let i = 0; i < a.length; i++) {
        let b = a[i].split('=');

        // handle multiple key values
        if(query.hasOwnProperty(decodeURIComponent(b[0]))){
            let arr = [];
            arr.push(query[decodeURIComponent(b[0])]);
            arr.push(decodeURIComponent(b[1] || ''));
            query[decodeURIComponent(b[0])] = arr;
        }
        else{
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
        }
    }
    return query;
}

export default {
    name: 'searchresults',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let parameters = getUriParams(args.queryparams);

        if(resource === 'searchresults.list'){
            // fetch results from search-microservice
            let searchServiceQuery = Microservices.search.uri + '/get/' + args.queryparams;

            request({
                uri: searchServiceQuery,
                method: 'GET'
            }, (err, response, body) => {

                let numFound = 0;
                let docs = {};
                let solrResponse = {};
                let error = false;

                if(err || response.statusCode !== 200){
                    error = true;
                }
                else{
                    solrResponse = JSON.parse(body);
                    // console.log(solrResponse);
                    numFound = solrResponse.numFound;
                    docs = solrResponse.docs;
                }

                callback(null, {
                    numFound: numFound,
                    docs: docs,
                    queryparams: (args.queryparams || ''),
                    searchstring: (parameters.q || ''),
                    entity: (parameters.entity || ''),
                    lang: parameters.lang,
                    group: parameters.group,
                    fields: parameters.fields,
                    users: parameters.users,
                    tags: parameters.tags,
                    error: error
                });
            });
        }
    }
};
