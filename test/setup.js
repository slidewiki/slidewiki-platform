'use strict';

let jsdom = require('jsdom');

const DEFAULT_HTML = '<!DOCTYPE html><html><body></body></html>';
global.document = jsdom.jsdom(DEFAULT_HTML);

global.window = document.defaultView;

global.navigator = window.navigator;
