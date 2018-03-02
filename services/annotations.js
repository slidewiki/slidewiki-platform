import rp from 'request-promise';

const SPARQL_QUERY = `PREFIX dbo:  <http://dbpedia.org/resource/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

SELECT ?subj ?link WHERE
{
    ?subj foaf:isPrimaryTopicOf ?link.
    FILTER(?subj IN (`;

//const SPOTLIGHT_BASE_URL = 'http://spotlight.sztaki.hu:2222/rest/annotate?text=';
const SPOTLIGHT_BASE_URL = 'www.dbpedia-spotlight.com/en/annotate?text=';
const MAX_HITS = 5;
const DBPEDIA_LOOKUP_BASE_URL = 'http://lookup.dbpedia.org/api/search.asmx/KeywordSearch?QueryString=';
const DBPEDIA_VIRTUOSO_BASE_URL = 'http://dbpedia.org/sparql';
const DBPEDIA_RESOURCE_PREFIX = 'dbo:';

/**
 * Created by korovin on 3/12/2017.
 */
export default {
    name: 'annotations',
    read: (req, resource, params, config, callback) => {
        switch (resource) {
            case 'annotations.suggestions':
                getDbpediaAnnotations(params, callback);
                break;
            case 'annotations.wikipedia':
                getWikipediaLinks(params, callback);
                break;
            case 'annotations.uri':
                getDbpediaURISuggestions(params, callback);
                break;
            default:
                callback(null, {success: false, results: {}});
                return;
        }
    }
};

function getDbpediaURISuggestions(params, callback) {
    if (!params.keyword || !params.type) {
        callback(null, {success: false, results: {}});
        return;
    }

    let queryClass = '&Quer‌​yClass=' + params.type.toLowerCase();
    let maxHits = '&MaxHits=' + MAX_HITS;
    let url = DBPEDIA_LOOKUP_BASE_URL + encodeURI(params.keyword) + queryClass + maxHits;

    rp.get({
        uri: url,
        headers: {
            'Accept': 'application/json'
        }
    }).then((res) => {
        callback(null, {
            success: true,
            results: JSON.parse(res).results
        });
    }).catch(err => {
        callback(null, {success: false, results: {}});
    });
}

function getDbpediaAnnotations(params, callback) {
    if (!params.text) {
        callback(null, {success: false, results: {}});
        return;
    }

    let url = SPOTLIGHT_BASE_URL + encodeURI(params.text) + '&confidence=0.4&support=20&types=' + encodeURI(params.types);

    rp.post({
        uri: url,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(res => {
        callback(null, {
            success: true,
            results: JSON.parse(JSON.stringify(res || null ))
        });
    }).catch(err => {
        callback(null, {success: false, results: {}});
    });
}

function getWikipediaLinks(params, callback) {
    if (!params.suggestions || !params.suggestions.length) {
        callback(null, {success: false, results: {}});
    }

    let sparqlLinks = params.suggestions.map(sug => {
        return DBPEDIA_RESOURCE_PREFIX + sug.id;
    }).join(',');

    rp.post({
        uri: DBPEDIA_VIRTUOSO_BASE_URL,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            query: SPARQL_QUERY + sparqlLinks + '))}',
            format: 'application/json'
        }
    }).then((res) => {
        callback(null, {
            success: true,
            results: JSON.parse(res)
        });
    }).catch(err => {
        callback(null, {success: false, results: {}});
    });

}
