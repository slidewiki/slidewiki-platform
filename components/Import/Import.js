import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import ImportStore from '../../stores/ImportStore';
import importFileSelect from '../../actions/importFileSelect';
import loadImportFile from '../../actions/loadImportFile';
import importFinished from '../../actions/importFinished';
let ReactDOM = require('react-dom');
//TODO - nice feature (later/non-critical) = drag & drop + upload multiple files

class Import extends React.Component {
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
    handleFileSelect(){
        //TODO - Check for correct format and
        //Do this via flux flow - this.props.ImportStore.isAllowed
        this.context.executeAction(importFileSelect, {});  // example copied from deck.js
        return false;
    }
    handleFileSubmit(){
        //TODO: show mockup progress bar
        //send loadImportFile event and get mock-up presentaton data from this.props.ImportStore.content from importStore.js
        this.context.executeAction(loadImportFile, {});  // example copied from deck.js
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
            outputDIV =      <div className="ui row">
                                <div className="column">
                                    <div className="ui content">
                                        <h2 className="ui header">Upload your presentation</h2>
                                        <p>Select your presentation file and upload it to SlideWiki. </p>
                                    </div>
                                    <br />
                                          <div className="ui input file focus animated" onChange={this.handleFileSelect.bind(this)}>
                                                <input ref="selectbutton"  type="file" accept="application/vnd.openxmlformats-officedocument.presentationml.presentation" tabIndex="0" onChange={this.handleFileSelect.bind(this)}></input>
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
                                    <div className="ui content">
                                        <p>Presentation formats currently supported: Powerpoint (*.pptx) </p>
                                        <p>Possible future support for: OpenOffice Impress (.odp, .odg, and .otp), Prezi, and Apple Keynote (.key)</p>
                                    </div>
                                    <br />
                                </div>
                            </div>;
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
