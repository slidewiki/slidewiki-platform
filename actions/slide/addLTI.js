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
    if (userid != null && userid !== '') {

        context.service.create('lticonsumer', payload, {timeout: 20 * 1000}, (err, res) => {
            //console.log('addLTI.js');
            //console.log('res='+res);
            if (err) {
                console.log(err);
                //console.log('ADD_LTI_FAILURE');
                context.dispatch('ADD_LTI_FAILURE', err);
            } else {
                context.dispatch('ADD_LTI_SUCCESS', res);
            }
            done();
        });

    } //end if (userid != null && userid !== '')
    else
        done();
}
