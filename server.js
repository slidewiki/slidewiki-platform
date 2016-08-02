/**
 * This leverages Express to create and run the http server.
 * A Fluxible context is created and executes the navigateAction
 * based on the URL. Once completed, the store state is dehydrated
 * and the application is rendered via React.
 */
import express from 'express';
import favicon from 'serve-favicon';
import serialize from 'serialize-javascript';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import compression from 'compression';
import debugLib from 'debug';
import path from 'path';
import {navigateAction} from 'fluxible-router';
import React from 'react';
import ReactDOM from 'react-dom/server';
import app from './app';
import HTMLComponent from './components/DefaultHTMLLayout';
import { createElementWithContext } from 'fluxible-addons-react';

const env = process.env.NODE_ENV;

const debug = debugLib('slidewiki-platform');

const server = express();
server.use(cookieParser());
server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
server.use(compression());
server.use(favicon(path.join(__dirname, '/favicon.ico')));
server.use('/public', express['static'](path.join(__dirname, '/build')));
server.use('/bower_components', express['static'](path.join(__dirname, '/bower_components')));
server.use('/custom_modules', express['static'](path.join(__dirname, '/custom_modules')));
server.use('/assets', express['static'](path.join(__dirname, '/assets')));

//server.use(csrf({cookie: true}));
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
fetchrPlugin.registerService(require('./services/import'));
fetchrPlugin.registerService(require('./services/presentation'));
fetchrPlugin.registerService(require('./services/notifications'));
fetchrPlugin.registerService(require('./services/searchresults'));

server.use((req, res, next) => {

    const context =  app.createContext({
        req: req
        //, // The fetchr plugin depends on this
        //xhrContext: {
        //    _csrf: req.csrfToken() // Make sure all XHR requests have the CSRF token
        //}
    });

    debug('Executing navigate action');
    context.getActionContext().executeAction(navigateAction, {
        url: req.url
    }, (err) => {
        if (err) {
            // console.log(err);
            if (err.statusCode && err.statusCode === 404) {
                // TODO refector the code in this if-else block
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
                res.status(err.statusCode).send('<!DOCTYPE html>' + html);
                // Pass through to next middleware
                //next();
            } else {
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
                res.status(err.statusCode).send('<!DOCTYPE html>' + html);
                //next(err);
            }
            return;
        }

        debug('Exposing context state');
        const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';

        debug('Rendering Application component into html');
        const markup = ReactDOM.renderToString(createElementWithContext(context));
        //todo: for future, we can choose to not include specific scripts in some predefined layouts
        const htmlElement = React.createElement(HTMLComponent, {
            //clientFile: env === 'production' ? 'main.min.js' : 'main.js',
            clientFile: 'main.js',
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
console.log('SlideWiki Platform is now Listening on port ' + port);

export default server;
