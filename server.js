/**
 * This leverages Express to create and run the http server.
 * A Fluxible context is created and executes the navigateAction
 * based on the URL. Once completed, the store state is dehydrated
 * and the application is rendered via React.
 */

import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';
import serialize from 'serialize-javascript';
import {navigateAction} from 'fluxible-router';
import debugLib from 'debug';
import React from 'react';
import ReactDOM from 'react-dom/server';
import app from './app';
import HTMLComponent from './components/DefaultHTMLLayout';
import { createElementWithContext } from 'fluxible-addons-react';
import favicon from 'serve-favicon';
const env = process.env.NODE_ENV;

const debug = debugLib('slidewiki-platform');

const server = express();
server.use(favicon(path.join(__dirname, '/favicon.ico')));
server.use('/public', express['static'](path.join(__dirname, '/build')));
server.use('/bower_components', express['static'](path.join(__dirname, '/bower_components')));
server.use('/custom_modules', express['static'](path.join(__dirname, '/custom_modules')));
server.use('/assets', express['static'](path.join(__dirname, '/assets')));
server.use(compression());
server.use(bodyParser.json());
// Get access to the fetchr plugin instance
let fetchrPlugin = app.getPlugin('FetchrPlugin');
// Set up the fetchr middleware
server.use(fetchrPlugin.getXhrPath(), fetchrPlugin.getMiddleware());
// Register our services
fetchrPlugin.registerService(require('./services/contributors'));
fetchrPlugin.registerService(require('./services/deck'));
fetchrPlugin.registerService(require('./services/slide'));
fetchrPlugin.registerService(require('./services/datasource'));
fetchrPlugin.registerService(require('./services/activities'));
fetchrPlugin.registerService(require('./services/decktree'));
fetchrPlugin.registerService(require('./services/translation'));
fetchrPlugin.registerService(require('./services/history'));
fetchrPlugin.registerService(require('./services/usage'));
fetchrPlugin.registerService(require('./services/questions'));
fetchrPlugin.registerService(require('./services/discussion'));
fetchrPlugin.registerService(require('./services/similarcontent'));

server.use((req, res, next) => {

    const context = app.createContext();

    debug('Executing navigate action');
    context.getActionContext().executeAction(navigateAction, {
        url: req.url
    }, (err) => {
        if (err) {
            if (err.statusCode && err.statusCode === 404) {
                // Pass through to next middleware
                next();
            } else {
                next(err);
            }
            return;
        }

        debug('Exposing context state');
        const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

        debug('Rendering Application component into html');
        const markup = ReactDOM.renderToString(createElementWithContext(context));
        //todo: for future, we can choose to not include specific scripts in some predefined layouts
        const htmlElement = React.createElement(HTMLComponent, {
            clientFile: env === 'production' ? 'main.min.js' : 'main.js',
            context: context.getComponentContext(),
            state: exposed,
            markup: markup
        });
        const html = ReactDOM.renderToStaticMarkup(htmlElement);

        debug('Sending markup');
        res.type('html');
        res.write('<!DOCTYPE html>' + html);
        res.end();
    });
});

const port = process.env.PORT || 3000;
server.listen(port);
console.log('Application listening on port ' + port);

export default server;
