import {shortTitle} from '../../configs/general';
import loadDeckRevisions from './loadDeckRevisions';
import loadSlideChanges from './loadSlideChanges';
import deckContentTypeError from '../error/deckContentTypeError';
import slideIdTypeError from '../error/slideIdTypeError';
import serviceUnavailable from '../error/serviceUnavailable';
import {AllowedPattern} from '../error/util/allowedPattern';
import {isEmpty} from '../../common.js';
import async from 'async';
const log = require('../log/clog');

export default function loadContentHistory(context, payload, done) {
    log.info(context);
    if (!(['deck', 'slide', 'question'].indexOf(payload.params.stype) > -1 || payload.params.stype === undefined)) {
        context.executeAction(deckContentTypeError, payload).catch((err) => {
            done(err);
        });
        return;
    }

    if (!(AllowedPattern.SLIDE_ID.test(payload.params.sid) || payload.params.sid === undefined)) {
        context.executeAction(slideIdTypeError, payload, done);
        return;
    }

    async.parallel([
        (callback) => {
            let splitSid = payload.params.sid.split('-');
            if (payload.params.stype === 'deck'){
                context.executeAction(loadDeckRevisions, {deckId: splitSid[0], revisionId: splitSid[1]}, callback);
            } else {
                context.executeAction(loadSlideChanges, {slideId: splitSid[0], deckId: payload.params.id}, callback);
            }
        }],
    // final callback
    (err, results) => {
        if (err) {
            log.error(context, {filepath: __filename, err: err});
            context.executeAction(serviceUnavailable, payload, done);
        } else {
            context.dispatch('UPDATE_MODULE_TYPE_SUCCESS', {moduleType: 'history'});
        }
        let pageTitle = shortTitle + ' | Content History | ' + payload.params.stype + ' | ' + payload.params.sid;
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: pageTitle
        });
        done();
    });
}
