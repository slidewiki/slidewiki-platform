# SlideWiki Platform #
[![Build Status](https://travis-ci.org/slidewiki/slidewiki-platform.svg?branch=master)](https://travis-ci.org/slidewiki/slidewiki-platform)
[![David](https://img.shields.io/david/slidewiki/slidewiki-platform.svg?style=flat-square)](https://david-dm.org/slidewiki/slidewiki-platform)
[![David](https://img.shields.io/david/dev/slidewiki/slidewiki-platform.svg?style=flat-square)](https://david-dm.org/slidewiki/slidewiki-platform#info=devDependencies)
[![Language](https://img.shields.io/badge/Language-Javascript%20ECMA2015-lightgrey.svg?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Framework](https://img.shields.io/badge/Framework-NodeJS%206-blue.svg?style=flat-square)](https://nodejs.org/)
[![LinesOfCode](https://img.shields.io/badge/LOC-43165-lightgrey.svg?style=flat-square)](https://github.com/slidewiki/Microservice-Template/blob/master/application/package.json)
[![Coverage Status](https://coveralls.io/repos/github/slidewiki/slidewiki-platform/badge.svg?branch=master)](https://coveralls.io/github/slidewiki/slidewiki-platform?branch=master)


## Installation ##

You should have installed [NodeJS](https://nodejs.org/), [npm](https://github.com/npm/npm) and [Webpack](https://webpack.github.io/) on your system as prerequisite, then:

Clone the repository recursively to make sure you clone the submodules as well: `git clone  --recursive https://github.com/slidewiki/slidewiki-platform.git`
Run:


`npm install`

add the config for your microservices:

`cp ./configs/microservices.sample.js ./configs/microservices.js`


## Run in Production Mode ##

`npm run build`


## Development Mode ##

`npm run dev`

check server at `localhost:3000`
