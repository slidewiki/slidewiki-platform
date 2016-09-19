import async from 'async';
import React from 'react';
import ReactDOM from 'react-dom/server';
let webshot = require('webshot');
import {shortTitle} from '../configs/general';
import loadContent from './loadContent';
import { deckIdTypeError, serviceUnavailable} from './loadErrors';

export default function loadDeck(context, payload, done) {
    console.log('payload:', payload);
    if (!(/^[0-9-]+$/.test(payload.params.id) && Number.parseInt(payload.params.id) >= 0)) {
        context.executeAction(deckIdTypeError, payload).catch((err) => {done(err);});
        return;
    }

    context.service.read('slidethumbnail.content', payload, {timeout: 20 * 1000}, (err, res) => {
        if (err) {
            context.executeAction(serviceUnavailable, payload).catch((error) => {done(error);});
            return;
        } else {
            console.log(res);
        }
    });
    done();
}
