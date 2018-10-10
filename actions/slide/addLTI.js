import UserProfileStore from '../../stores/UserProfileStore';
import {shortTitle} from '../../configs/general';
import striptags from 'striptags';
import TreeUtil from '../../components/Deck/TreePanel/util/TreeUtil';
const log = require('../log/clog');
import addActivity from '../activityfeed/addActivity';
import {navigateAction} from 'fluxible-router';
import Util from '../../components/common/Util';

export default function addLTI(context, payload, done) {
    //log.info(context);
    //console.log('actions/slide/addLTI.js');
    //enrich with user id
    let userid = context.getStore(UserProfileStore).userid;
    var requestPayload = payload;

    //console.log('userid='+userid);
    if (userid != null && userid !== '') {

        context.service.create('lticonsumer', payload, {timeout: 20 * 1000}, (err, res) => {
          console.log('addLTI.js');
          //console.log('res='+res);
          if (err) {
              console.log(err);
              //console.log('ADD_LTI_FAILURE');
              context.dispatch('ADD_LTI_FAILURE', err);
          } else {
            /*
              console.log("addLTI.js'.res="+res);
              console.log('LTI_ADD_SUCCESS');
              console.log('addLTI.requestPayload.ltiURL='+requestPayload.ltiURL);
              console.log('addLTI.requestPayload.oauth_consumer_key='+requestPayload.params.oauth_consumer_key);
              */
              context.dispatch('ADD_LTI_SUCCESS', res);
          }
          done();
        });

    } //end if (userid != null && userid !== '')
    else
        done();
}
