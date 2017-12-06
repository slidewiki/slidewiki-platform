require('babel-register')();
// setup file
let enzyme = require('enzyme');
let Adapter = require('enzyme-adapter-react-15');

enzyme.configure({ adapter: new Adapter() });
