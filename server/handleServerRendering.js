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
import { loadIntlMessages } from '../actions/intl';
import { IntlProvider } from 'react-intl';



const env = process.env.NODE_ENV;


export default function handleServerRendering(req, res, next) {
    const context =  app.createContext({
        req: req,
        res: res
    });


    // //Getting default browser language and saving it in cookie
    // let locale = detectLocale(req);
    // res.cookie('locale', locale, { maxAge: (new Date() * 0.001) + (365 * 24 * 3600) });

    //debug('Executing navigate action');
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
                    markup: markup,
                    lang: req.locale
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
                    markup: markup,
                    lang: req.locale
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
}
