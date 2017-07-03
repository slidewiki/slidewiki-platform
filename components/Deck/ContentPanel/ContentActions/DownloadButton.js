import React from 'react';
import { Button, Icon,Dropdown} from 'semantic-ui-react';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../../stores/ContentStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import {Microservices} from '../../../../configs/microservices';
import addActivity from '../../../../actions/activityfeed/addActivity';

class DownloadButton extends React.Component{
    constructor(props) {
        super(props);
        this.dropDown = null;
        //this.getExportHref = this.getExportHref.bind(this);
        this.state ={
            selectedItem :''
        };
    }
    componentDidMount(){
        $('#downloadButton').dropdown({action: this.handleDownloadSelection.bind(this), selectOnKeydown: false});


    }

    getExportHref(type){
        let splittedId;
        if (this.props.ContentStore.selector.id !== undefined && this.props.ContentStore.selector.id !== '' && this.props.ContentStore.selector.id !== 0){

            splittedId =  this.props.ContentStore.selector.id.split('-'); //separates deckId and revision
        } else {
            return ''; //no deckId
        }

        switch (type) {
            case 'PDF':
                return Microservices.pdf.uri + '/exportPDF/' + splittedId[0];
                break;
            case 'ePub':
                return Microservices.pdf.uri + '/exportEPub/' + splittedId[0];
                break;
            case 'SCORMv1.2':
            case 'SCORMv2':
            case 'SCORMv3':
            case 'SCORMv4':
                let version = type.split('v'); //separates format from version. In second position we have the version
                return Microservices.pdf.uri + '/exportSCORM/' + splittedId[0]+ '?version='+version[1];
                break;
            default:
                return '';

        }


    }
    createDownloadActivity() {
        //create new activity
        let splittedId =  this.props.ContentStore.selector.id.split('-'); //separates deckId and revision
        let userId = String(this.props.UserProfileStore.userid);
        if (userId === '') {
            userId = '0';//Unknown - not logged in
        }
        let activity = {
            activity_type: 'download',
            user_id: userId,
            content_id: splittedId[0],
            content_kind: 'deck'
        };
        this.context.executeAction(addActivity, {activity: activity});
    }
    handleDownloadSelection(text,value){
        this.setState({
            selectedItem : text
        });
        if(process.env.BROWSER){
            //event.preventDefault();
            window.open(this.getExportHref(text));
        }
        $('#downloadButton').dropdown('hide');
        this.createDownloadActivity();

    }

    render(){

        let downloadOptions =[
          {value:'PDF' , text:'PDF'},
          {value:'ePub' , text:'ePub'},
          {value:'SCORMv1.2' , text:'SCORM 1.2'},
          {value:'SCORMv2' , text:'SCORM 2004 (3rd edition)'},
          {value:'SCORMv3' , text:'SCORM 2004 (4th edition)'},
          {value:'SCORMv4' , text:'SCORM 2004 (5th edition)'},
          //{value:'' , text:''},
        ];
          /*icon='download large'*/
          /*
            <Dropdown
                button
                icon='download large'
                aria-label='Download. Choose the export format.'
                data-tooltip='Download.Choose the export format.'
                item
                options={downloadOptions}
                closeOnChange
                defaultValue = ""
                onChange = {this.handleDownloadSelection.bind(this)}
                ref = {(dropDown) => {this.dropDown = dropDown;}}
                >



              //If we use menu, the component is not key accesible..
             <Dropdown.Menu >

                <Dropdown.Header content='Export format:' />
              < Dropdown.Divider />

               <Dropdown.Item value='PDF' text='PDF' onClick={this.handleDownloadSelection.bind(this)}/>
               <Dropdown.Item value='ePub' text='ePub' onClick={this.handleDownloadSelection.bind(this)} />
               <Dropdown.Item value='SCORMv1.2' text='SCORM 1.2'onClick={this.handleDownloadSelection.bind(this)} />
               <Dropdown.Item value='SCORMv2' text='SCORM 2004 (3rd edition)' onClick={this.handleDownloadSelection.bind(this)} />
               <Dropdown.Item value='SCORMv3' text='SCORM 2004 (4th edition)' onClick={this.handleDownloadSelection.bind(this)} />
               <Dropdown.Item value='SCORMv4' text='SCORM 2004 (5th edition)'  onClick={this.handleDownloadSelection.bind(this)} />


             </Dropdown.Menu>

            </Dropdown>
            */
        return(
            <div className="ui icon dropdown button"
            id="downloadButton"
            aria-label="Download. Choose the export format."
            data-tooltip="Download. Choose the export format."
            aria-haspopup="true"
            ref = {(dropDown) => {this.dropDown = dropDown;}}
            >
                 <i className="download large icon"></i>
                 <div className="menu"   role="menu">
                  <div className="header">Export format:</div>
                  <div className="divider"></div>
                  <div className="item" data-text="PDF" role="menuitem" aria-label="PDF" aria-selected={this.state.selectedItem === 'PDF'}>PDF</div>
                  <div className="item" data-text="ePub" role="menuitem" aria-label="ePub" aria-selected={this.state.selectedItem === 'ePub'} >ePub</div>
                  <div className="item" data-text="SCORMv1.2" role="menuitem" aria-label="SCORM 1.2" aria-selected={this.state.selectedItem === 'SCORMv1.2'}>SCORM 1.2</div>
                  <div className="item" data-text="SCORMv2"role="menuitem" aria-label="SCORM 2004 (3rd edition)" aria-selected={this.state.selectedItem === 'SCORMv2'} >SCORM 2004 (3rd edition)</div>
                  <div className="item" data-text="SCORMv3"role="menuitem" aria-label="SCORM 2004 (4th edition)" aria-selected={this.state.selectedItem === 'SCORMv3'}>SCORM 2004 (4th edition)</div>
                  <div className="item" data-text="SCORMv4"role="menuitem"aria-label="SCORM 2004 (5th edition)"  aria-selected={this.state.selectedItem === 'SCORMv4'} >SCORM 2004 (5th edition)</div>
                  </div>
            </div>
        );
    }
}

DownloadButton.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

DownloadButton = connectToStores(DownloadButton,[ContentStore,UserProfileStore],(context,props) => {
    return{
        ContentStore : context.getStore(ContentStore).getState(),
        UserProfileStore : context.getStore(UserProfileStore).getState()
    };
});
export default DownloadButton;
