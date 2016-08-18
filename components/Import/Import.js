import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import ImportStore from '../../stores/ImportStore';
import storeFile from '../../actions/import/storeFile';
import uploadFile from '../../actions/import/uploadFile';
import importFinished from '../../actions/import/importFinished';
//import FileUploader from './FileUploader';
let ReactDOM = require('react-dom');
let classNames = require('classnames');
//TODO - nice feature (later/non-critical) = drag & drop + upload multiple files

const MAX_FILESIZE = 300 * 1024 * 1024;

class Import extends React.Component {
    constructor(props) {
        super(props);
        this.fileReadyForUpload = false;
    }
    componentDidMount(){

    }
    componentDidUpdate(){

    }
    handleFileSelect(evt){
        console.log('handleFileSelect()');
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

            function abortRead() {
                reader.abort();
            }

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

            function updateProgress(evt) {
              //TODO
              /*
                // evt is an ProgressEvent.
                if (evt.lengthComputable) {
                    let percentLoaded = Math.round((evt.loaded / evt.total) * 100);
                    // Increase the progress bar length.
                    if (percentLoaded < 100) {
                        progress.style.width = percentLoaded + '%';
                        progress.textContent = percentLoaded + '%';
                    }
                }
                */
            }

            // Reset progress indicator on new file selection.
            //TODO: use react/fluxible style for DOM manipulation

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

                    that.fileReadyForUpload = true;
                };
            })();
            reader.onerror = errorHandler;
            reader.onprogress = updateProgress;
            reader.onabort = function(e) {
                console.error('File read cancelled');
            };
            reader.onloadstart = function(e) {
                // progress.className = 'loading';
            };
            reader.onload = function(e) {
                // Ensure that the progress bar displays 100% at the end.
                // progress.style.width = '100%';
                // progress.textContent = '';//'100%';
                setTimeout(() => {
                    // progress.className = '';
                }, 2000);
            };

            // Read in the file
            reader.readAsBinaryString(file);

            ReactDOM.findDOMNode(this.refs.submitbutton).focus();
        }

        return false;
    }
    handleFileSubmit(){
        console.log('handleFileSubmit()');

        this.fileReadyForUpload = false;

        if (this.props.ImportStore.file !== null) {
            //call action
            const payload = {
                file: this.props.ImportStore.file,
                base64: this.props.ImportStore.base64
            };
            this.context.executeAction(uploadFile, payload);
        }
        else {
            console.error('Submission not possible - no file or not pptx');
        }

        return false;
    }
    //redirect to presentation deck with id (input param)
    handleRedirect(id){
        this.context.executeAction(importFinished, {});  // destroy current state
        this.context.executeAction(navigateAction, {
            url: '/deck/' + id
        });
        return false;
    }
    render() {
        //variable for intermediate storage of output
        let outputDIV = '';

        let uploadBtn_classes = classNames({
            'ui': true,
            'animated': true,
            'approve': true,
            'disabled': !this.fileReadyForUpload,
            'button': true,
            'green': true
        });

        if(this.props.ImportStore.isUploaded){
            //show upload message
            outputDIV =  <div className="ui bottom attached segment">
                          <div dangerouslySetInnerHTML={{__html:this.props.ImportStore.resultMessage}} />
                         </div>;
            setTimeout( () => {
                //TODO - clear ImportStore - when user goes back to import page - gets initial state
                this.handleRedirect(Math.floor(Math.random(1,1000000)*100));
            }, 13000);
        } else {
            outputDIV =     <div className="ui small modal" ref="import">
                                <div className="header">
                                    <h2>Upload your presentation</h2>
                                </div>
                                <div className="content">
                                    <p>Select your presentation file and upload it to SlideWiki.</p>
                                    <p>Only PowerPoint (.pptx) is supported.</p>
                                    <div className="ui input file focus animated">
                                          <input ref="selectbutton" accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" type="file" tabIndex="0" onChange={this.handleFileSelect.bind(this)}></input>
                                    </div>
                                </div>
                                <div className="actions">
                                    <button tabIndex="0" ref="submitbutton" className={uploadBtn_classes} onClick={this.handleFileSubmit.bind(this)} onChange={this.handleFileSubmit.bind(this)}>
                                        <div className="visible content"><i className="upload icon"></i>Upload <i className="upload icon"></i></div>
                                        <div tabIndex="0" className="hidden content" ><i className="thumbs up icon"></i>To SlideWiki<i className="thumbs up icon"></i></div>
                                    </button>
                                    <div className="ui cancel button red" tabIndex="0">Cancel</div>
                                </div>
                            </div>;
                            //TODO: use react/semantic-UI progress bar

                            //from https://github.com/risis-eu/risis-datasets/blob/2a790c3b20b6c83c775d144cd69393032cdfaf82/components/object/ObjectIEditor.js
                            //editor = <FileUploader spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} onEnterPress={this.handleEnterPress.bind(this)} allowActionByKey="1"/>;

        }
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
