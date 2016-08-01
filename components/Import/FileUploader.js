import React from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import {Microservices} from '../../configs/microservices';
//import csrf from 'csurf';
//var csrf = require('csurf')
//import express from 'express';
//var request = require('superagent');
//var csrf = require('superagent-csrf-middleware');
//var req = request('server');
//var req = request(express);

class FileUploader extends React.Component {
    constructor(props) {
        super(props);
        //let v = this.props.spec.value;
        //this.state = {value: v};
        //this.props.config.filePrefix = '';
        //this.props.config.fileSizeLimit = 5000;
    }
    componentDidMount() {

    }
    getRandomNumber() {
        return Math.round(+new Date() / 1000);
    }
    getFormatFromName(name) {
        let tmp = name.split('.');
        return tmp[tmp.length - 1];
    }
    onDrop(files) {

//OR USE EXPRESS INSTEAD OF SUPERAGENT?? SUPERAGENT IS CLIENTSIDE...
//var request = require('superagent');

//let req = require('superagent');

//require('superagent-csrf')(request);

//request
//  .post('https://segment.io')
//  .csrf(token)
//  .end(function (err, res) {
//  [...]
//});

        let req, fname;
        //var csrf1 = csrf();
//        req.
        //require('superagent-csrf')(request);

        //let token = window._csrf;

        req = request.post(Microservices.import.uri + '/importPPTX');
        //connect to import-service on platform
        //req = request.post('platform.manfredfris.ch/importfile')
        //req = request.post('http://localhost:3000/import')
        //req = request.post('http://localhost:3000/importfile')
        //req.post('/importfile')
        //.use(csrf())
        //.csrf(token)
        //.use(csrf1)
        //SEE TODO - https://github.com/visionmedia/superagent/issues/746
        //.set('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        //.set('Content-Type', 'application/x-www-form-urlencoded');
        //.set('Content-Type', 'multipart/form-data');
        /*.then((res) => {
            console.log('result of call to import-microservice' + res); //can comment when it is ready
            //console.log(JSON.parse(res)); //can comment when it is ready
            callback(null, {htmlConvert: res});
        }).catch((err) => {
            console.log(err);
            callback(null, {htmlConvert: {}, file: args.file});
        });*/
        //files.forEach((file) => {
            //fname = encodeURIComponent(this.props.config.filePrefix) + this.getRandomNumber() + '.' + this.getFormatFromName(file.name);
            //fname = file.name;
            //SEND TO MICROSERVICE INSTEAD:::
            //req = request.post('/uploadFile/' + fname + '/' + this.props.config.fileSizeLimit)
            //Microservices.import.uri + '/importPPTX'
/*can attach multiple files:
request
  .post('/upload')
  .attach('avatar', 'path/to/tobi.png', 'user.png')
  .attach('image', 'path/to/loki.png')
  .attach('file', 'path/to/jane.png')
  .end(callback);
  */
  //is multipart request: https://visionmedia.github.io/superagent/
  //TODO: try multipart multipart/form-data?
  // SEE RISIS SERVER.JS FOR EXAMPLE

            //console.log(file);
        console.log(files[0]);
            //req.attach('file', file, file.name);
            //need to convert to bytearray for sending over HTTP
            // -or- convert to JSON in import-microservice
        req.attach('file', files[0], files[0].name);
        //});
        req.on('progress', (e) => {
            console.log('Percentage done: ', e.percent);
        //});
        }).end((err,res) => {
            //this.props.onDataEdit(this.props.config.uploadFolder + '/' + fname);
            //this.setState({value: this.props.config.uploadFolder + '/' + fname});
            //this.props.onEnterPress();
            console.log(err,res);
        });




    }
    ////<Dropzone onDrop={this.onDrop.bind(this)} ref="fileUploader" multiple={false} accept="application/pdf, application/msword,  application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation">
    //                <Dropzone onDrop={this.onDrop.bind(this)} ref="fileUploader" multiple={false} accept="application/vnd.openxmlformats-officedocument.presentationml.presentation">


    render() {

        return (
                <div className="ui">
                    <Dropzone onDrop={this.onDrop.bind(this)} ref="fileUploader" multiple={false} accept="application/vnd.openxmlformats-officedocument.presentationml.presentation">
                      <div><div className="ui basic big button info">Try dropping the file here, or click here to select your file to upload.</div></div>
                    </Dropzone>
                </div>
        );
    }
}

export default FileUploader;
//                <input ref="basicIndividualInput" type="text" value={this.state.value} placeholder={placeholder} onChange={this.handleChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}/>
