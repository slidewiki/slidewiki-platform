// Express middleware to render the app server-side and expose its state
// to the client

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom/server';
import app from '../app';
import HTMLComponent from '../components/DefaultHTMLLayout';

import { createElementWithContext } from 'fluxible-addons-react';
import serialize from 'serialize-javascript';
import debugLib from 'debug';
const debug = debugLib('slidewiki-platform');

import { navigateAction } from 'fluxible-router';
import {loadIntlMessages} from '../actions/loadIntl'; //feeds the store with default messages
import { IntlProvider } from 'react-intl';


const env = process.env.NODE_ENV;

let renderApp = function(req, res, context){
    debug('Exposing context state');
    const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

    const Root = app.getComponent();

    const messages = require('../intl/'+req.locale +'.json');

    // Render the Root to string
    const content = ReactDOM.renderToString(
      <IntlProvider locale={ req.locale } messages = {messages}>
        <Root context={ context.getComponentContext() } />
      </IntlProvider>
    );

    debug('Rendering Application component into html');



    //todo: for future, we can choose to not include specific scripts in some predefined layouts
    const htmlElement = React.createElement(HTMLComponent, {
        //clientFile: env === 'production' ? 'main.min.js' : 'main.js',
        clientFile: 'main.js',
        addAssets: (env === 'production'),
        context: context.getComponentContext(),
        state: exposed,
        markup: content,
        lang: req.locale
    });
    const html = ReactDOM.renderToStaticMarkup(htmlElement);
    return html;
};


export default function handleServerRendering(req, res, next){

    const context =  app.createContext({
        req: req,
        res: res
    });

    debug('Executing loadIntl action');
    context.getActionContext().executeAction(loadIntlMessages, req.locale, (err) => {
        if (err) {
            err.statusCode = 503;
            let html = '<h1>Not found locale</h1>';
            debug('Sending markup');
            res.type('html');
            res.status(err.statusCode).send('<!DOCTYPE html>' + html);
        }
        else{
            debug('Executing navigate action');
            context.getActionContext().executeAction(navigateAction, {
                url: req.url
            }, (err) => {
                if (err) {
                    console.log(req.url, err);//, err);
                    if (err.statusCode) {
                        let html = renderApp(req, res, context);
                        debug('Sending markup');
                        res.type('html');
                        res.status(err.statusCode).send('<!DOCTYPE html>' + html);
                    } else {
                        err.statusCode = 503;
                        let html = renderApp(req, res, context);
                        debug('Sending markup');
                        res.type('html');
                        res.status(err.statusCode).send('<!DOCTYPE html>' + html);
                    }
                    return;
                } else {
                    let html = renderApp(req, res, context);
                    debug('Sending markup');
                    res.type('html');
                    res.write('<!DOCTYPE html>' + html);
                    res.end();
                }
            });
        }
    });
}
