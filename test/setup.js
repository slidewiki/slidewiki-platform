require('babel-register')();
// setup file
var enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-15');

enzyme.configure({ adapter: new Adapter() });
