import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ImportStore from '../../stores/ImportStore';
import loadImportFile from '../../actions/loadImportFile';

class Import extends React.Component {
    handleFileSelect(){
        //this.context.executeAction(restoreDeckPageLayout, {}); // example copied from deck.js
        //alert("File selected");
        //Check for correct format and, if correct, enable submit button - do via this.props.ImportStore.mode or this.props.ImportStore.uploadAllowed
        //$('#ImportFile').enable();
        return false;
    }
    handleFileSubmit(){
        //show mockup progress bar
        //alert("File Submitted for upload");
        this.context.executeAction(loadImportFile, {});  // example copied from deck.js
        return false;
    }
    render() {
        let outputDIV = '';
        if(this.props.ImportStore.isUploaded){
            outputDIV =  <div className="ui bottom attached segment">
                          <div dangerouslySetInnerHTML={{__html:this.props.ImportStore.content}} />
                         </div>;
        }else{
            outputDIV =      <div className="ui row">
                                <div className="column">
                                    <div className="ui content">
                                        <h2 className="ui header">Upload your presentation</h2>
                                        <p>Select your presentation file and upload it to SlideWiki. </p>
                                    </div>
                                    <br />
                                    <form className="ui form" onChange={this.handleFileSelect.bind(this)}>
                                          <div className="ui input file focus animated">
                                                <input type="file" accept="application/vnd.openxmlformats-officedocument.presentationml.presentation"></input>
                                                <div id="submitbutton" className="ui focus animated button green" onClick={this.handleFileSubmit.bind(this)}>
                                                      <div className="visible content" onClick={this.handleFileSubmit.bind(this)}><i className="upload icon"></i>Upload <i className="upload icon"></i></div>
                                                      <div className="hidden content"><i className="thumbs up icon"></i>To SlideWiki<i className="thumbs up icon"></i></div>
                                                </div>
                                                <div className="ui error message"></div>
                                          </div>
                                    </form>
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
