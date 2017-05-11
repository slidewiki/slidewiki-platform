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
import { locales } from './configs/general'; //a list of supported locales, defines also the localeSwitcher component
import Cookie from 'js-cookie';
import locale from 'locale';
import handleServerRendering from './server/handleServerRendering'; //moved here the rendering part
import setLocale from './server/setLocale'; //sets the locale from browser or cookies


const env = process.env.NODE_ENV;
// So we can check whether we are in the browser or not.  Required for webpack-load-css
//otherwise it will try and transpile CSS into JavaScript.
process.env.BROWSER = false;

const debug = debugLib('slidewiki-platform');

const host = process.env.HOST ? process.env.HOST : '0.0.0.0';
let port = 3000 ;
if(env === 'production'){
    port = process.env.PORT ? process.env.PORT :  3000;
}else{
    port = process.env.PORT ? parseInt(process.env.PORT) + 1 : 3001;
}

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

server.use('/ckeditor', express.static(path.join(__dirname, 'node_modules/ckeditor')));
server.use('/ckeditor-plugins/youtube', express.static(path.join(__dirname, 'node_modules/ckeditor-youtube-plugin/youtube')));
server.use('/ckeditor-plugins/lineheight', express.static(path.join(__dirname, 'node_modules/ckeditor-lineheight-plugin')));
server.use('/mathjax', express.static(path.join(__dirname, 'node_modules/mathjax')));

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
fetchrPlugin.registerService(require('./services/usergroup'));
fetchrPlugin.registerService(require('./services/userProfile'));
fetchrPlugin.registerService(require('./services/suggester'));
fetchrPlugin.registerService(require('./services/logservice'));
fetchrPlugin.registerService(require('./services/like'));


// ************************** UI Internationalisation routines ***************************************

// locale data from the intl library
import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import es from 'react-intl/locale-data/es';
import ru from 'react-intl/locale-data/ru';
import de from 'react-intl/locale-data/de';
import ca from 'react-intl/locale-data/ca';
import gd from 'react-intl/locale-data/gd';
import nl from 'react-intl/locale-data/nl';
import el from 'react-intl/locale-data/el';
import it from 'react-intl/locale-data/it';
import cy from 'react-intl/locale-data/cy';

addLocaleData([...en, ...fr, ...es, ...ru, ...de, ...ca, ...gd, ...nl, ...el, ...it, ...cy]);


// Set the default locale

locale.Locale.default = locales[0]; //the default locale is the first locale from a config

// Set req.locale based on the browser settings

server.use(locale(locales));

// Overwrite req.locale either from cookie or querystring, if it is supported

server.use(setLocale);

// ************************************ Rendering ***************************************************

//render the server, as previous but from a separate file
server.use(handleServerRendering);
server.listen(port);
if(env === 'production'){
    console.log('[production environment] Check your application on http://%s:%s', host, port);
}else{
    console.log('[development environment] Proxy server listening on port ' + port);
    console.log('[development environment] Check your application on http://%s:%s', host, port-1);
}

export default server;
