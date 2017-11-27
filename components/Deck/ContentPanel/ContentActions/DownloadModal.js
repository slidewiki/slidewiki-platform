import React from 'react';
import FocusTrap from 'focus-trap-react';
import { Button, Container, Form, Modal, Radio, Icon, Segment, Grid } from 'semantic-ui-react';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../../stores/ContentStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import {Microservices} from '../../../../configs/microservices';
import addActivity from '../../../../actions/activityfeed/addActivity';
import incrementDeckViewCounter from '../../../../actions/activityfeed/incrementDeckViewCounter';
import {FormattedMessage, defineMessages} from 'react-intl';


class DownloadModal extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeTrap: false,
            radioValue: 'PDF'

        };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);


        this.messages = defineMessages({
            downloadModal_header:{
                id: 'downloadModal.downloadModal_header',
                defaultMessage:'Download this deck'
            },
            downloadModal_description:{
                id: 'downloadModal.downloadModal_description',
                defaultMessage:'Select the download file format:'
            },
            downloadModal_downloadButton:{
                id:'downloadModal.downloadModal_downloadButton',
                defaultMessage: 'Download'
            },
            downloadModal_cancelButton:{
                id:'downloadModal.downloadModal_cancelButton',
                defaultMessage: 'Cancel'
            }
        });
    }

    handleOpen(){
        $('#app').attr('aria-hidden', 'true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });

    }


    handleClose(){
        $('#app').attr('aria-hidden', 'false');
        this.setState({
            modalOpen: false,
            activeTrap: false
        });

    }
    unmountTrap() {
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }
    handleRadioChange(event,data){
        this.setState({
            radioValue:data.value
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
    handleDownload(event,data){
        if(process.env.BROWSER){
            event.preventDefault();
            window.open(this.getExportHref(this.state.radioValue));
        }

        this.createDownloadActivity();


    }

    render() {
        return(

              <Modal
                  trigger={
                        <Button icon aria-hidden="false" className="ui secondary button" type="button" aria-label="Download" data-tooltip="Download" onClick={this.handleOpen} >
                              <Icon name='download' size='large'/>
                        </Button>
                  }

                  open={this.state.modalOpen}
                  onClose={this.handleClose}
                  id="downloadModal"
                  aria-labelledby="downloadModalHeader"
                  aria-describedby="downloadModalDescription"
                  aria-hidden = {!this.state.modalOpen}
                  role="dialog"
                  tabIndex="0"
              >
                  <FocusTrap
                      id="focus-trap-downloadModal"
                      className = "header"
                      active={this.state.activeTrap}
                      focusTrapOptions={{
                          onDeactivate: this.unmountTrap,
                          clickOutsideDeactivates: true ,
                          initialFocus: '#downloadModalDescription'
                      }}
                  >
                      <Modal.Header className="ui center aligned" id="downloadModalHeader">
                          <h1 style={{'textAlign': 'center'}}> {this.context.intl.formatMessage(this.messages.downloadModal_header)}</h1>
                      </Modal.Header>
                      <Modal.Content>
                          <Container>
                              <Segment color="blue" textAlign="center" padded>
                                <Segment>
                                  <Form id="downloadForm" >
                                   <Grid >
                                   <Grid.Row>

                                   <Grid.Column width={3}>

                                   </Grid.Column>

                                   <Grid.Column textAlign='left' width={13} role="radiogroup" aria-labelledby="downloadModalDescription">
                                    <div  id="downloadModalDescription" tabIndex='0'>{this.context.intl.formatMessage(this.messages.downloadModal_description)}</div>
                                    <Form.Field >
                                          <Radio
                                            label='PDF'
                                            name='downloadRadioGroup'
                                            value='PDF'
                                            checked={this.state.radioValue === 'PDF'}
                                            onChange={this.handleRadioChange}
                                            role="radio"
                                            aria-checked={this.state.radioValue === 'PDF'}
                                            aria-label='PDF'
                                            tabIndex="0"

                                            />
                                        </Form.Field>
                                        <Form.Field>
                                          <Radio
                                              label='ePub'
                                              name='downloadRadioGroup'
                                              value='ePub'
                                              checked={this.state.radioValue === 'ePub'}
                                              onChange={this.handleRadioChange}
                                              role="radio"
                                              aria-checked={this.state.radioValue === 'ePub'}
                                              aria-label='ePub'
                                              tabIndex="-1"

                                          />
                                         </Form.Field>
                                         <Form.Field>
                                           <Radio
                                               label='SCORM 1.2'
                                               name='downloadRadioGroup'
                                               value='SCORMv1.2'
                                               checked={this.state.radioValue === 'SCORMv1.2'}
                                               onChange={this.handleRadioChange}
                                               role="radio"
                                               aria-checked={this.state.radioValue === 'SCORMv1.2'}
                                               aria-label='SCORM 1.2'
                                               tabIndex="-1"

                                           />
                                          </Form.Field>
                                          <Form.Field>
                                            <Radio
                                                label='SCORM 2004 (3rd edition)'
                                                name='downloadRadioGroup'
                                                value='SCORMv2'
                                                checked={this.state.radioValue === 'SCORMv2'}
                                                onChange={this.handleRadioChange}
                                                role="radio"
                                                aria-checked={this.state.radioValue === 'SCORMv2'}
                                                aria-label='SCORM 2004 (3rd edition)'
                                                tabIndex="-1"

                                            />
                                          </Form.Field>
                                          <Form.Field>
                                            <Radio
                                                label='SCORM 2004 (4th edition)'
                                                name='downloadRadioGroup'
                                                value='SCORMv3'
                                                checked={this.state.radioValue === 'SCORMv3'}
                                                onChange={this.handleRadioChange}
                                                role="radio"
                                                aria-checked={this.state.radioValue === 'SCORMv3'}
                                                aria-label='SCORM 2004 (4th edition)'
                                                tabIndex="-1"
                                            />
                                          </Form.Field>
                                          <Form.Field>
                                            <Radio
                                                label='SCORM 2004 (5th edition)'
                                                name='downloadRadioGroup'
                                                value='SCORMv4'
                                                checked={this.state.radioValue === 'SCORMv4'}
                                                onChange={this.handleRadioChange}
                                                role="radio"
                                                aria-checked={this.state.radioValue === 'SCORMv4'}
                                                aria-label='SCORM 2004 (5th edition)'
                                                tabIndex="-1"
                                            />
                                          </Form.Field>

                                      </Grid.Column>
                                      <Grid.Column>
                                      </Grid.Column>
                                      </Grid.Row>
                                      <Grid.Row>

                                      <Grid.Column width={16} textAlign='center'>
                                      <Button
                                          color="blue"
                                          type="submit"
                                          content={this.context.intl.formatMessage(this.messages.downloadModal_downloadButton)}
                                          icon='download'
                                          onClick={this.handleDownload}
                                      />
                                      <Button
                                          icon="remove"
                                          color="red"
                                          type="button"
                                          onClick={this.handleClose}
                                          content={this.context.intl.formatMessage(this.messages.downloadModal_cancelButton)}
                                      />
                                      </Grid.Column>
                                      </Grid.Row>

                                      </Grid>

                                  </Form>


                                </Segment>
                              </Segment>
                          </Container>

                      </Modal.Content>

                  </FocusTrap>
              </Modal>

        );

    }


}

DownloadModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};
DownloadModal = connectToStores(DownloadModal,[ContentStore,UserProfileStore],(context,props) => {
    return{
        ContentStore : context.getStore(ContentStore).getState(),
        UserProfileStore : context.getStore(UserProfileStore).getState()
    };
});

export default DownloadModal;
