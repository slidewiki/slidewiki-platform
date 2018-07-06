import UserProfileStore from '../../stores/UserProfileStore';
import {shortTitle} from '../../configs/general';
import striptags from 'striptags';
import TreeUtil from '../../components/Deck/TreePanel/util/TreeUtil';
const log = require('../log/clog');
import addActivity from '../activityfeed/addActivity';
import {navigateAction} from 'fluxible-router';

import serviceUnavailable from '../error/serviceUnavailable';

export default function addLTI(context, payload, done) {
    //log.info(context);
    console.log('addLTI');
    //console.log('payload='+JSON.stringify(payload));
    //enrich with user id
    let userid = context.getStore(UserProfileStore).userid;
    console.log('payload.ltiURL='+payload.ltiURL);
    //console.log('payload.oauth_consumer_key='+payload.params.oauth_consumer_key);

    //enrich with root deck id if deck to be revised is not uppermost deck
    //let parent = TreeUtil.getParentId(payload.selector);
  //  payload.root_deck = parent;

    console.log('userid='+userid);
    if (userid != null && userid !== '') {
        //enrich with jwt
        //payload.jwt = context.getStore(UserProfileStore).jwt;
        context.service.create('lti', payload, {timeout: 20 * 1000}, (err, res) => {
          if (err) {
              console.log('ADD_LTI_FAILURE');
              //context.dispatch('ADD_LTI_FAILURE', err);
          } else {
              console.log('LTI_ADD_SUCCESS');
              //context.dispatch('LTI_ADD_SUCCESS', res);
          }
          done();
        });

        /*
        context.service.create('lti', payload, {timeout: 20 * 1000}, (err, res) => {
            if (err) {
                context.dispatch('SAVE_SLIDE_EDIT_FAILURE', err);
            } else {

                console.log('ltiClick.js response');

            }

            done();
        });
        */
    } //end if (userid != null && userid !== '')
    else
        done();
}
