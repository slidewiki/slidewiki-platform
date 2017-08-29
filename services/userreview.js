import { Microservices } from '../configs/microservices';
import rp from 'request-promise';
const log = require('../configs/log').log;

export default {
    name: 'userreview',
    // At least one of the CRUD methods is Required
    read: (req, resource, params, config, callback) => {
        req.reqId = req.reqId ? req.reqId : -1;
        log.info({Id: req.reqId, Service: __filename.split('/').pop(), Resource: resource, Operation: 'read', Method: req.method});
        let args = params.params ? params.params : params;


        let secret = args.secret;




        if (resource === 'userreview.nextreviewable') {


//for testing
            // let username = (!args.new) ? 'dpaun' : 'dpaun2';
            // let userid = '16';
            // let secretCorrect = true;
            // callback(null, {username: username, userid: userid, secret: secret, secretCorrect: secretCorrect});




            rp.get({uri: Microservices.user.uri + '/getNextReviewableUser?secret=' + secret, headers: {'----jwt----': args.jwt }}).then((res) => {




// {
//       userid: 0,
//       username: '',
//       decks: 0,
//       addedByReviewer: 0
//     }


                callback(null, {user: JSON.parse(res), secret: secret, secretCorrect: true});
            }).catch((err) => {
                console.log(err.StatusCodeError, err.message, err.options);
                callback(null, {secret: secret, secretCorrect: false});
            });
          } else if (resource === 'userreview.user') {




///////////////////////////////////////////////
//OVO NE POSTOJI.....



//for testing
              let username = 'dpaun';
              let userid = '16';
              let reviewable = true;
              //jwt
              callback(null, {username: username, userid: userid, reviewable: reviewable});

                //WHAT IS THE PATH?
              // rp.get({uri: Microservices.user.uri + '/user/' + args.userid + '/getReviewableUser', headers: {'----jwt----': args.jwt }}).then((res) => {
              //     callback(null, {res: JSON.parse(res), secret: secret});
              // }).catch((err) => {
              //     console.log(err.StatusCodeError, err.message, err.options);
              //     callback(null, {});
              // });
          } else if (resource === 'userreview.approve') {



            callback(null, {});



            // rp.get({uri: Microservices.user.uri + '/user/' + args.userid + '/approve?secret=' + secret, headers: {'----jwt----': args.jwt }}).then((res) => {
            //     callback(null, JSON.parse(res));
            // }).catch((err) => {
            //     console.log(err.StatusCodeError, err.message, err.options);
            //     callback(null, {});
            // });
        } else if (resource === 'userreview.suspend') {



                      callback(null, {});




            // rp.get({uri: Microservices.user.uri + '/user/' + args.userid + '/suspend?secret=' + secret, headers: {'----jwt----': args.jwt }}).then((res) => {
            //     callback(null, JSON.parse(res));
            // }).catch((err) => {
            //     console.log(err.StatusCodeError, err.message, err.options);
            //     callback(null, {});
            // });
        } else if (resource === 'userreview.keepreviewing') {


                      callback(null, {});





            // rp.get({uri: Microservices.user.uri + '/user/' + args.userid + '/addToQueue?secret=' + secret, headers: {'----jwt----': args.jwt }}).then((res) => {
            //     callback(null, JSON.parse(res));
            // }).catch((err) => {
            //     console.log(err.StatusCodeError, err.message, err.options);
            //     callback(null, {});
            // });
        }

    }

};
