import {Microservices} from '../configs/microservices';
import rp from 'request';
import formdata from 'form-data';
const util = require('util');

export default {
    name: 'import',
    create: (req, resource, params, body, config, callback) => {
        let form = new formdata();

        //let keys = [];
        //for(let k in params) keys.push(k);
        //console.log('import service', keys, params.file, params.base64.length);

        const defaultLicense = 'CC0';
        //create a HTTP POST form request
        form.append('file', params.base64);
        form.append('filename', params.filename ? params.filename : 'unknown');
        form.append('user', params.user);
        form.append('license', defaultLicense);
        form.append('contentType', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
            //knownLength: params.file.size ? params.file.size : params.base64.length

        let request = form.submit({
            port: Microservices.import.port ? Microservices.import.port : 80,
            host: Microservices.import.host,
            path: Microservices.import.path ? Microservices.import.path : '/',
            protocol: Microservices.import.protocol ? Microservices.import.protocol : 'http:',
            timeout: body.timeout
        }, (err, res) => {
            //res.setTimeout(body.timeout);

            if (err) {
                console.error(err);
                //only callback if no timeout
                if (err.toString() !== 'Error: XMLHttpRequest timeout')
                    callback(err, null);
                return;
            }

            console.log('result of call to import-microservice', res.headers, res.statusCode);
            //res does not contain any data ...
            //the response data have to be send via headers
            callback(null, res.headers);
        });
    }
};

// examples for server code

//get file in memory
/*
'use strict';

var http = require('http'),
    inspect = require('util').inspect;

var Busboy = require('busboy');

http.createServer(function(req, res) {
  if (req.method === 'POST') {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function() {
      console.log('Done parsing form!');
      res.writeHead(303, { Connection: 'close', Location: '/' });
      res.end();
    });
    req.pipe(busboy);
  } else if (req.method === 'GET') {
    res.writeHead(200, { Connection: 'close' });
    res.end('<html><head></head><body>\
               <form method="POST" enctype="multipart/form-data">\
                <input type="text" name="textfield"><br />\
                <input type="file" name="filefield"><br />\
                <input type="submit">\
              </form>\
            </body></html>');
  }
}).listen(8003, function() {
  console.log('Listening for requests');
});
*/

//get file on disk
/*
var multiparty = require('multiparty');
var http = require('http');
var util = require('util');

http.createServer(function(req, res) {
console.log(req.headers, req.url, req.method);
  if (req.url === '/importPPTX' && req.method === 'POST') {
    // parse a file upload
    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
console.log('got data', fields, files);
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
}).listen(8003);
*/
