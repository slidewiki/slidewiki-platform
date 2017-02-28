import async from 'async';
import {navigateAction} from 'fluxible-router';
import loadSlideEdit from './loadSlideEdit';
import needsNewRevisionCheck from '../revisioning/needsNewRevisionCheck';
import UserProfileStore from '../../stores/UserProfileStore';
import ContentUtil from '../../components/Deck/ContentPanel/util/ContentUtil';

export default function loadSlideEditWihtRevisionControl(context, payload, done) {
    let currentUserState = context.getStore(UserProfileStore).getState();
    let args = payload.params? payload.params : payload;
    let selector= {'id': String(args.id), 'spath': args.spath, 'sid': String(args.sid), 'stype': args.stype};
    const nodeURL = ContentUtil.makeNodeURL(selector, 'view');
    //make sure user is logged-in, otherwise redirect to view
    if (currentUserState.username === '') {
        context.executeAction(navigateAction, {
            url: nodeURL
        });
        done();
    }else{
        //load all required actions in parallel
        async.parallel([
            (callback) => {
                const spath = selector.spath;
                let tmp = spath.split(';');
                let targetDeckID;
                if(tmp.length > 1){
                    targetDeckID = tmp[tmp.length - 2];
                    tmp = targetDeckID.split(':');
                    targetDeckID = tmp[0];
                }else{
                    //target is root deck
                    targetDeckID = selector.id;
                }
                const userID =  currentUserState.userid;
                //check the revisioning condition
                context.executeAction(needsNewRevisionCheck, {
                    deckID: targetDeckID,
                    userID: userID
                }, callback);
            },
            (callback) => {
                context.executeAction(loadSlideEdit, payload, callback);
            }
        ],
        // final callback
        (err, results) => {
            done();
        });
    }
}
