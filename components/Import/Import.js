import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import ImportStore from '../../stores/ImportStore';
import storeFile from '../../actions/import/storeFile';
import importFinished from '../../actions/import/importFinished';
//import FileUploader from './FileUploader';
let ReactDOM = require('react-dom');
let classNames = require('classnames');
//TODO - nice feature (later/non-critical) = drag & drop + upload multiple files

const MAX_FILESIZE = 300 * 1024 * 1024;

class Import extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){

    }
    componentDidUpdate(){
        if (this.props.ImportStore.file === null)
            $('#import_file_chooser').val('');
    }
    handleFileSelect(evt){
        console.log('handleFileSelect()');

        this.context.executeAction(importFinished, null);

        console.log(evt.target.files[0]);
        let file = evt.target.files[0];
        if (file === null || file === undefined)
            file = {
                type: '',
                size: 0
            };

        //check metadata like size, file ending, ...
        let isCorrect = true;
        const filetype = file.type;
        const size = file.size;
        isCorrect = ( filetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ) && ( size < MAX_FILESIZE );

        if (isCorrect) {
            let reader = new FileReader();

            function errorHandler(evt) {
                switch(evt.target.error.code) {
                    case evt.target.error.NOT_FOUND_ERR:
                        console.error('File Not Found!');
                        break;
                    case evt.target.error.NOT_READABLE_ERR:
                        console.error('File is not readable');
                        break;
                    case evt.target.error.ABORT_ERR:
                        console.info('Cancel clicked');
                        break; // noop
                    default:
                        console.error('An error occurred reading this file.', evt.target.error);
                };
            }

            let that = this;

            // Closures to capture the file information/data
            reader.onloadend = (function(theFile) {
                return function(e) {
                    console.log('file was read: ', file);
                    console.log('also', theFile);
                    console.log(e.target.result.length, 'bytes');

                    //Save it to store
                    const payload = {
                        file: file ? file : theFile,
                        base64: e.target.result
                    };
                    that.context.executeAction(storeFile, payload);
                };
            })();
            reader.onerror = errorHandler;
            reader.onabort = function(e) {
                console.error('File read cancelled');
            };

            // Read in the file
            reader.readAsDataURL(file);

            ReactDOM.findDOMNode(this.refs.submitbutton).focus();
        }

        return false;
    }
    render() {
        //variable for intermediate storage of output
        let outputDIV = '';

        let uploadBtn_classes = classNames({
            'ui': true,
            'animated': true,
            'approve': true,
            'disabled': !this.props.ImportStore.fileReadyForUpload,
            'button': true,
            'green': true
        });

        outputDIV =   <div className="ui small modal" ref="import">
                          <div className="header">
                              <h2>Upload your presentation</h2>
                          </div>
                          <div className="content">
                              <p>Select your presentation file and upload it to SlideWiki.</p>
                              <p>Only PowerPoint (.pptx) is supported.</p>
                              <div className="ui input file focus animated">
                                    <input ref="selectbutton" accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" type="file" tabIndex="0" onChange={this.handleFileSelect.bind(this)} id="import_file_chooser" ></input>
                              </div>
                          </div>
                          <div className="actions">
                              <button tabIndex="0" ref="submitbutton" className={uploadBtn_classes} >
                                  <div className="visible content"><i className="upload icon"></i>Upload <i className="upload icon"></i></div>
                                  <div className="hidden content" ><i className="thumbs up icon"></i>To SlideWiki<i className="thumbs up icon"></i></div>
                              </button>
                              <div className="ui cancel button red" tabIndex="0">Cancel</div>
                          </div>
                      </div>;

                      //from https://github.com/risis-eu/risis-datasets/blob/2a790c3b20b6c83c775d144cd69393032cdfaf82/components/object/ObjectIEditor.js
                      //editor = <FileUploader spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} onEnterPress={this.handleEnterPress.bind(this)} allowActionByKey="1"/>;


        return outputDIV;
    }
}


Import.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
Import = connectToStores(Import, [ImportStore], (context, props) => {
    return {
        ImportStore: context.getStore(ImportStore).getState()
    };
});
export default Import;
