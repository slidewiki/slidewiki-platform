import {Microservices} from '../configs/microservices';
import rp from 'request-promise';

export default {
    name: 'decktree',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'id': parseInt(args.id), 'spath': args.spath, 'sid': parseInt(args.sid), 'stype': args.stype};

        if(resource === 'decktree.nodes'){
            /*********connect to microservices*************/
            rp.get({uri: Microservices.deck.uri + '/decktree/' + selector.id}).then((res) => {
                callback(null, {deckTree: JSON.parse(res), selector: selector, 'page': params.page, 'mode': args.mode});
            }).catch((err) => {
                console.log(err);
                callback(null, {deckTree: {}, selector: selector, 'page': params.page, 'mode': args.mode});
            });
        }
    },
    create: (req, resource, params, body, config, callback) => {
        let args = params.params? params.params : params;
        if(resource === 'decktree.node'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            let node = {};
            let rnd = Math.round(Math.random()*800) + 1;
            if(args.nodeSpec.type === 'slide'){
                if(args.nodeSpec.id){
                    //it means it is an existing node
                    node = {title: 'Existing Slide', id: 11, type: 'slide'};
                }else{
                    //need to make a new slide
                    node = {title: 'New Slide', id: rnd, type: 'slide'};
                }
            }else{
                if(args.nodeSpec.id){
                    //it means it is an existing node
                    node = {title: 'Existing Deck', id: 53, type: 'deck',  children: [
                            {title: 'Syntax', id: 685, type: 'slide'},
                            {title: 'Slide34', id: 691, type: 'slide'}
                    ]};
                }else{
                    //need to make a new slide
                    node = {title: 'New Deck', id: rnd, type: 'deck',  children: [
                            {title: 'New Slide', id: rnd, type: 'slide'}
                    ]};
                }
            }
            callback(null, {node: node, selector: args.selector});
        }
    },
    update: (req, resource, params, body, config, callback) => {
        if(resource === 'decktree.nodeTitle'){
            // only update if the value has changed
            if(params.oldValue === params.newValue){
                callback(null, params);
            }
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            callback(null, params);
        }
    },
    delete: (req, resource, params, config, callback) => {
        if(resource === 'decktree.node'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/
            callback(null, params);
        }
    }
};
