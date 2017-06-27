import React from 'react';
import { Button, Icon,Dropdown} from 'semantic-ui-react';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../../stores/ContentStore';

class DownloadButton extends React.Component{
    constructor(props) {
        super(props);
    }
    getExportHref(type){

        if (type !== 'EPub' && type !== 'PDF') {
            return;
        }
        if (this.ContentStore.selector.id !== undefined && this.ContentStore.selector.id !== '' && this.ContentStore.selector.id !== 0)
        {
            //console.log(this.props.ContentStore.selector.id);
            let splittedId =  this.props.ContentStore.selector.id.split('-'); //separates deckId and revision
            let pdfHref = Microservices.pdf.uri + '/export' + type + '/' + splittedId[0];

            return pdfHref;
        }
        else
        {
            // in adddeck this.props.ContentStore.selector.id is 0
            return Microservices.pdf.uri + '/export' + type + '/';
        }
    }

    render(){
        let downloadOptions =[
          {value:'ePub' , text:'ePub'},
          {value:'SCORM1.2' , text:'SCORM 1.2'},
          {value:'SCORM2' , text:'SCORM 2004 (3rd edition)'},
          {value:'SCORM3' , text:'SCORM 2004 (4th edition)'},
          {value:'SCORM4' , text:'SCORM 2004 (5th edition)'},
          {value:'PDF' , text:'PDF'}
        ];
        return(
          <Dropdown icon='download large' button search >
           <Dropdown.Menu>
            <Dropdown.Header content='Export format:' />
            <Dropdown.Divider />
             <Dropdown.Item value='PDF' text='PDF' />
             <Dropdown.Item value='ePub' text='ePub' />
             <Dropdown.Item value='1.2' text='SCORM 1.2' />
             <Dropdown.Item value='2' text='SCORM 2004 (3rd edition)' />
             <Dropdown.Item value='3' text='SCORM 2004 (4th edition)' />
             <Dropdown.Item value='4' text='SCORM 2004 (5th edition)' />
           </Dropdown.Menu>
          </Dropdown>
        );
    }
}

DownloadButton = connectToStores(DownloadButton,[ContentStore],(context,props) => {
    return{
        ContentStore : context.getStore(ContentStore).getState()
    };
});
export default DownloadButton;
