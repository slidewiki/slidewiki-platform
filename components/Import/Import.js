import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import ImportStore from '../../stores/ImportStore';
import importFileSelect from '../../actions/importFileSelect';
import loadImportFile from '../../actions/loadImportFile';
import importFrontend from '../../actions/importFrontend';
import importFinished from '../../actions/importFinished';
import FileUploader from './FileUploader';
let ReactDOM = require('react-dom');
//TODO - nice feature (later/non-critical) = drag & drop + upload multiple files

//pptx2html = require('../PPTX2HTML/js/pptx2html');
import pptx2html from './PPTX2HTML/js/pptx2html';

class Import extends React.Component {
    constructor(props) {
        super(props);
        this.currentcontent;
        this.props.ImportStore.file;
        this.props.ImportStore.htmlConvert;
    }
    componentDidMount(){
        //after loading component - focus on select-file button
        ReactDOM.findDOMNode(this.refs.selectbutton).focus();
    }
    componentDidUpdate(){
        if (this.props.ImportStore.isAllowed && !this.props.ImportStore.isUploaded)
        {
            //if fileformat is correct and file is not yet being uploaded
            ReactDOM.findDOMNode(this.refs.submitbutton).focus();
        }
    }
    handleFileSelect(evt){
        console.log("TESTING");
        console.log(evt.target.files[0]);
        let file = evt.target.files[0];
        this.props.ImportStore.file = file;

        let HTMLoutput = pptx2html.convert(evt.target.files[0]); //TODO - needs callback to assign to HTMLoutput
        //console.log(pptx2html.convert(evt.target.files[0]));
        //console.log('return value' + test);
        //this.props.ImportStore.HTMLoutput = HTMLoutput;

        //pptx2html.convert(file);
        //TODO - Check for correct format and
        //Do this via flux flow - this.props.ImportStore.isAllowed
        //this.context.executeAction(loadImportFile, {file: file});  // example copied from deck.js
        //this.context.executeAction(importFileSelect, {file: file});  // example copied from deck.js
        //this.context.executeAction(importFrontend, {HTMLoutput: HTMLoutput});  // example copied from deck.js


        //IMMEDIATELY SEND TO IMPORT-MICROSERVICE?!?!


        //NEEDS HEADER - ALLOW FROM THIS DOMAIN (IN MICROSERVICE?!)
        return false;
    }
    handleFileSubmit(){
        //TODO: show mockup progress bar
        //send loadImportFile event and get mock-up presentaton data from this.props.ImportStore.content from importStore.js
        //let file = this.props.ImportStore.file;
        //console.log('test in handleFileSubmit' + this.props.ImportStore.file);
        //this.context.executeAction(loadImportFile, {file: this.props.ImportStore.file});  // example copied from deck.js
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
                          <div dangerouslySetInnerHTML={{__html:this.props.ImportStore.content}} />
                         </div>;
                         //TODO - Progressbar - nice feature = get upload state from store and show in upload state. E.g. importing slide 1 of 99. See example in slidecontrol.js
            //mock-up timeout for redirect simulates time for uploading
            setTimeout( () => {
                //TODO - clear ImportStore - when user goes back to import page - gets initial state
                this.handleRedirect(Math.floor(Math.random(1,1000000)*100));
            }, 3000);
        }else{
            //landing page - show file-select button and upload button
            //                                          <div className="ui input file focus animated" onChange={this.handleFileSelect.bind(this)}>
//                                                <input ref="selectbutton"  type="file" accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" tabIndex="0" onChange={this.handleFileSelect.bind(this)}></input>
/*
<br />
      <div className="ui input file focus animated" onChange={this.handleFileSelect.bind(this)}>
            <input ref="selectbutton"  type="file" tabIndex="0" onChange={this.handleFileSelect.bind(this)}></input>
            {!this.props.ImportStore.isAllowed ?
              <div tabIndex="0" ref="submitbutton" className="ui animated button green disabled">
                <div className="visible content"><i className="upload icon"></i>Upload <i className="upload icon"></i></div>
                <div className="hidden content"><i className="thumbs up icon"></i>To SlideWiki<i className="thumbs up icon"></i></div>
              </div>
              :
              <button tabIndex="0" ref="submitbutton" className="ui animated button green" onClick={this.handleFileSubmit.bind(this)} onChange={this.handleFileSubmit.bind(this)}>
                <div className="visible content"><i className="upload icon"></i>Upload <i className="upload icon"></i></div>
                <div tabIndex="0" className="hidden content" ><i className="thumbs up icon"></i>To SlideWiki<i className="thumbs up icon"></i></div>
              </button>
            }
      </div>
<br />
*/

            outputDIV =      <div className="ui row">
            {this.props.ImportStore.htmlConvert}
                                <div className="column">
                                    <div className="ui content">
                                        <h2 className="ui header">Upload your presentation</h2>
                                        <p>Select your presentation file and upload it to SlideWiki. </p>
                                        <p>UPLOAD FOR FRONTEND/CLIENTSIDE-JS TEST OF PPTX2HTML LIBRARY (can use client-side/JS libraries/jquery, etc.. -> need to rewrite part of this): </p>
                                    </div>
                                    <br />
                                          <div className="ui input file focus animated" onChange={this.handleFileSelect.bind(this)}>
                                                <input ref="selectbutton" accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" type="file" tabIndex="0" onChange={this.handleFileSelect.bind(this)}></input>
                                                {!this.props.ImportStore.isAllowed ?
                                                  <div tabIndex="0" ref="submitbutton" className="ui animated button green disabled">
                                                    <div className="visible content"><i className="upload icon"></i>Upload <i className="upload icon"></i></div>
                                                    <div className="hidden content"><i className="thumbs up icon"></i>To SlideWiki<i className="thumbs up icon"></i></div>
                                                  </div>
                                                  :
                                                  <button tabIndex="0" ref="submitbutton" className="ui animated button green" onClick={this.handleFileSubmit.bind(this)} onChange={this.handleFileSubmit.bind(this)}>
                                                    <div className="visible content"><i className="upload icon"></i>Upload <i className="upload icon"></i></div>
                                                    <div tabIndex="0" className="hidden content" ><i className="thumbs up icon"></i>To SlideWiki<i className="thumbs up icon"></i></div>
                                                  </button>
                                                }
                                          </div>
                                    <br />
                                    <br />
                                    <br />
                                    <p>UPLOAD FOR BACKEND(IMPORT-MICROSERVICE)+SERVERSIDE-JS TEST OF PPTX2HTML LIBRARY (NEEDS NODE.JS/ES6 libraries): </p>
                                     <FileUploader allowActionByKey="1"/>
                                    <div className="ui content">
                                        <p>Presentation formats currently supported: Microsoft Powerpoint (*.pptx) and LibreOffice Open Document Presentation (*.odp) </p>
                                        <p>Planned future support for: Open/LibreOffice Impress (.odg and .otp), Prezi, and Apple Keynote (.key)</p>
                                    </div>
                                    <br />
                                    <div id='test'>OUTPUT FRONTENDTEST</div>
                                </div>

                            </div>;
                            //from https://github.com/risis-eu/risis-datasets/blob/2a790c3b20b6c83c775d144cd69393032cdfaf82/components/object/ObjectIEditor.js
                            //editor = <FileUploader spec={this.props.spec} config={this.props.config} onDataEdit={this.handleDataEdit.bind(this)} onEnterPress={this.handleEnterPress.bind(this)} allowActionByKey="1"/>;

        }
        return (
            <div className="ui page grid" ref="import">
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
