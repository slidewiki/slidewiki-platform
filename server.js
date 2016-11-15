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
// So we can check whether we are in the browser or not.  Required for webpack-load-css
//otherwise it will try and transpile CSS into JavaScript.
process.env.BROWSER = false;

const debug = debugLib('slidewiki-platform');

const server = express();
server.use(cookieParser());
server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
server.use(compression());
server.use(favicon(path.join(__dirname, '/favicon.ico')));
server.use('/public', express.static (path.join(__dirname, '/build')));
server.use('/custom_modules', express.static (path.join(__dirname, '/custom_modules')));
server.use('/assets', express.static (path.join(__dirname, '/assets')));
//server.use('/bower_components', express.static (path.join(__dirname, '/bower_components')));
//add external dependencies to be loaded on frontend here:
server.use('/json3', express.static(path.join(__dirname, '/node_modules/json3')));
server.use('/es5-shim', express.static(path.join(__dirname, '/node_modules/es5-shim')));
server.use('/es6-shim', express.static(path.join(__dirname, '/node_modules/es6-shim')));
server.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery')));
server.use('/sweetalert2', express.static(path.join(__dirname, '/node_modules/sweetalert2')));
server.use('/headjs', express.static(path.join(__dirname, '/node_modules/headjs')));

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
fetchrPlugin.registerService(require('./services/user'));
fetchrPlugin.registerService(require('./services/searchresults'));
fetchrPlugin.registerService(require('./services/userProfile'));
fetchrPlugin.registerService(require('./services/suggester'));

server.use((req, res, next) => {

    const context =  app.createContext({
        req: req,
        res: res  //for userStoragePlugin
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
            console.log(req.url, err);//, err);
            if (err.statusCode && err.statusCode === 404) {
                // TODO refector the code in this if-else block
                const exposed = 'window.App=' + serialize(app.dehydrate(context)) + ';';
                debug('Rendering Application component into html');
                const markup = ReactDOM.renderToString(createElementWithContext(context));
                //todo: for future, we can choose to not include specific scripts in some predefined layouts
                const htmlElement = React.createElement(HTMLComponent, {
                    clientFile: 'main.js',
                    addAssets: (env === 'production'),
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
                    clientFile: 'main.js',
                    addAssets: (env === 'production'),
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
            addAssets: (env === 'production'),
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
