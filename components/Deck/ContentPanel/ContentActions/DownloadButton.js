import React from 'react';
import { Button, Icon,Dropdown} from 'semantic-ui-react';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../../stores/ContentStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import {Microservices} from '../../../../configs/microservices';
import addActivity from '../../../../actions/activityfeed/addActivity';
import incrementDeckViewCounter from '../../../../actions/activityfeed/incrementDeckViewCounter';
import {FormattedMessage, defineMessages} from 'react-intl';

class DownloadButton extends React.Component{
    constructor(props) {
        super(props);
        this.dropDown = null;
        //this.getExportHref = this.getExportHref.bind(this);
        this.selectedFormat = null;
        this.messages = defineMessages({
            swal_title:{
                id: 'DownloadButton.swal_title',
                defaultMessage:'Deck Download'
            },
            swal_text:{
                id: 'DownloadButton.swal_text',
                defaultMessage:'Do you want to download the deck in '
            },
            swal_acept:{
                id: 'DownloadButton.swal_acept',
                defaultMessage:'Yes'
            },
            swal_reject:{
                id: 'DownloadButton.swal_reject',
                defaultMessage:'No'

            }


        });
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
        context.executeAction(incrementDeckViewCounter, {type: 'download'});
    }
    handleOnChange(event,data){
        console.log('onChange');
        console.log('data');
        console.log(data.value);
        console.log(data);
        this.selectedFormat = data.value;

    }

    handleOnClose(event, data){
        console.log('onClose');
        console.log(this.selectedFormat);
        if(this.selectedFormat !== undefined){
            console.log(this.selectedFormat);

            swal({
                title: this.context.intl.formatMessage(this.messages.swal_title),
                text:this.context.intl.formatMessage(this.messages.swal_text) +' '+this.selectedFormat+'?',
                type: 'warning',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: this.context.intl.formatMessage(this.messages.swal_acept),
                confirmButtonAriaLabel:this.context.intl.formatMessage(this.messages.swal_acept),
                cancelButtonText:this.context.intl.formatMessage(this.messages.swal_reject),
                cancelButtonAriaLabel:this.context.intl.formatMessage(this.messages.swal_reject),
                confirmButtonClass: 'ui olive button',
                cancelButtonClass: 'ui red button',
                allowEscapeKey: false,
                allowOutsideClick: false,
                buttonsStyling: false,

            })
            .then((accepted) => {
                //download
                if(process.env.BROWSER){
                    //event.preventDefault();
                    window.open(this.getExportHref(this.selectedFormat));
                }

                this.selectedFormat = undefined;
                this.createDownloadActivity();

            },(reason) => {
                //done(reason);

                this.selectedFormat = undefined;
            });
        }


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

        let icon_object = <Icon name='download' size='large'/>;
          /*icon='download large'*/
        return(
          <Dropdown as={Button}
              icon
              icon={icon_object}
              aria-label='Download. Choose the export format.'
              data-tooltip='Download. Choose the export format.'
              item
              options={downloadOptions}
              closeOnChange
              defaultValue = ""
              onChange = {this.handleOnChange.bind(this)}            
              onClose = {this.handleOnClose.bind(this)}
              ref = {(dropDown) => {this.dropDown = dropDown;}}
              >


            {/*}
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
           */}
          </Dropdown>
        );
    }
}

DownloadButton.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};


DownloadButton = connectToStores(DownloadButton,[ContentStore,UserProfileStore],(context,props) => {
    return{
        ContentStore : context.getStore(ContentStore).getState(),
        UserProfileStore : context.getStore(UserProfileStore).getState()
    };
});
export default DownloadButton;
