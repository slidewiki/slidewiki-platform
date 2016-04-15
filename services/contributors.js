export default {
    name: 'contributors',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        let args = params.params? params.params : params;
        let selector= {'sid': args.sid, 'stype': args.stype};
        if(resource === 'contributors.list'){
            /*********connect to microservices*************/
            //todo
            /*********received data from microservices*************/

        	//
            let sampleData =[];

            if(args.sid%2===0){
                sampleData = [
                  {'id': '1', 'username': 'ali1k', 'organization': 'VUA', 'creator':false, 'type':'contributor', 'avatar':'dgirl.jpeg', 'did': args.did, 'sid': args.sid},
                  {'id': '2', 'username': 'soeren', 'organization': 'Fraunhofer', 'creator':true, 'type':'creator', 'avatar':'man_512.png', 'did': args.did, 'sid': args.sid},
                  {'id': '3', 'username': 'darya', 'organization': 'Bonn', 'creator':false, 'type':'contributor', 'avatar':'batman_512.jpg', 'did': args.did, 'sid': args.sid},
                  {'id': '4', 'username': 'penny', 'organization': 'ATHENA', 'creator':false, 'type':'translator', 'avatar':'girl2.jpeg', 'did': args.did, 'sid': args.sid}
                ];
            }
        	  else{
                sampleData = [
                  {'id': '1', 'username': 'ali1k', 'organization': 'VUA', 'creator':true, 'type':'creator', 'avatar':'dgirl.jpeg', 'did': args.did, 'sid': args.sid},
                  {'id': '2', 'username': 'soeren', 'organization': 'Fraunhofer', 'creator':false, 'type':'contributor', 'avatar':'man_512.png', 'did': args.did, 'sid': args.sid},
                  {'id': '4', 'username': 'penny', 'organization': 'ATHENA', 'creator':false, 'type':'contributor', 'avatar':'girl2.jpeg', 'did': args.did, 'sid': args.sid},
                  {'id': '3', 'username': 'darya', 'organization': 'Bonn', 'creator':false, 'type':'translator', 'avatar':'batman_512.jpg', 'did': args.did, 'sid': args.sid},
                  {'id': '1', 'username': 'ali1k', 'organization': 'VUA', 'creator':true, 'type':'translator', 'avatar':'dgirl.jpeg', 'did': args.did, 'sid': args.sid}
                ];
            }

            callback(null, {contributors: sampleData, selector: selector});
        }
    }
    // other methods
    // create: (req, resource, params, body, config, callback) => {},
    // update: (req, resource, params, body, config, callback) => {}
    // delete: (req, resource, params, config, callback) => {}
};
