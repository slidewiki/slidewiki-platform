import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import ImportStore from '../../stores/ImportStore';
import storeFile from '../../actions/import/storeFile';
import uploadFile from '../../actions/import/uploadFile';
import importFinished from '../../actions/import/importFinished';
//import FileUploader from './FileUploader';
let ReactDOM = require('react-dom');
//TODO - nice feature (later/non-critical) = drag & drop + upload multiple files

const MAX_FILESIZE = 300 * 1024 * 1024;

class Import extends React.Component {
    constructor(props) {
        super(props);
        this.currentcontent;
    }
    componentDidMount(){
        //after loading component - focus on select-file button
        ReactDOM.findDOMNode(this.refs.selectbutton).focus();
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

            let progress = this.refs.progress_bar;

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
            progress.style.width = '0%';
            progress.textContent = '0%';

            let currentContext = this.context;

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
                    currentContext.executeAction(storeFile, payload);
                };
            })();
            reader.onerror = errorHandler;
            reader.onprogress = updateProgress;
            reader.onabort = function(e) {
                console.error('File read cancelled');
            };
            reader.onloadstart = function(e) {
                progress.className = 'loading';
            };
            reader.onload = function(e) {
                // Ensure that the progress bar displays 100% at the end.
                progress.style.width = '100%';
                progress.textContent = '';//'100%';
                setTimeout(() => {
                    progress.className = '';
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
            outputDIV =      <div className="ui row">
                                <div className="column">
                                    <div className="ui content">
                                        <h2 className="ui header">Upload your presentation</h2>
                                        <p>Select your presentation file and upload it to SlideWiki. </p>
                                    </div>
                                    <br />
                                          <div className="ui input file focus animated">
                                                <input ref="selectbutton" accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" type="file" tabIndex="0" onChange={this.handleFileSelect.bind(this)}></input>
                                                <button tabIndex="0" ref="submitbutton" className="ui animated button green" onClick={this.handleFileSubmit.bind(this)} onChange={this.handleFileSubmit.bind(this)}>
                                                    <div className="visible content"><i className="upload icon"></i>Upload <i className="upload icon"></i></div>
                                                    <div tabIndex="0" className="hidden content" ><i className="thumbs up icon"></i>To SlideWiki<i className="thumbs up icon"></i></div>
                                                  </button>

                                          </div>
                                          <div className="" ref="progress_bar">
                                              <div className="progress"> </div>
                                          </div>
                                </div>
                            </div>;
                            //TODO: use react/semantic-UI progress bar

                            //from https://github.com/risis-eu/risis-datasets/blob/2a790c3b20b6c83c775d144cd69393032cdfaf82/components/object/ObjectIEditor.js
                            //editor = <FileUploader spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} onEnterPress={this.handleEnterPress.bind(this)} allowActionByKey="1"/>;

        }
        return (
            <div className="ui container grid" ref="import">
                {outputDIV}
            </div>
        );
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
