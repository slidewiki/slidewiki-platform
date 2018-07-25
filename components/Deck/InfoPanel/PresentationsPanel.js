import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import ContentStore from '../../../stores/ContentStore';
import {isLocalStorageOn} from '../../../common.js';
import ReactList from 'react-list';
import { Icon, Button, Popup, Grid, Divider, Input} from 'semantic-ui-react';
import { Microservices } from '../../../configs/microservices';
import {isEmpty} from '../../../common';

class PresentationsPanel extends React.Component {

    getPresentationHref(){
        let presLocation = '/presentation/' + this.props.ContentStore.selector.id + '/';
        if(!this.props.ContentStore.selector.subdeck){

            presLocation += this.props.ContentStore.selector.id + '/';
        }
        else{
            presLocation += this.props.ContentStore.selector.subdeck + '/';
        }
        if(this.props.ContentStore.selector.stype === 'slide'){
            // presLocation += this.props.ContentStore.selector.sid + '/';
            presLocation += this.props.ContentStore.selector.sid;// + '/';
        }
        return presLocation;
    }
    openChooseASessionModal(e){
        let modalContent = <Grid columns={2} divided padded>
          <Grid.Column width={8}>
            <Button icon labelPosition="left" onClick={this.openPRModal.bind(this)} aria-label="Create a presentation room, beta"><Icon name="record" size="large"/> Presentation Room</Button>
            <br/><br/>
            <p style={{textAlign: 'justify'}}>This will immediately create a <i>Presentation Room</i>, open the room as a new tab and hand you a link to invite attendees. Partcipants will hear your voice, have a one way chat as well as a live subtitle. <i>Presentation Rooms</i> are always public and listed at the deck.</p>
            <p style={{textAlign: 'justify'}}>Please test that a <i>Presentation Room</i> is working for you, as we encountered that <i>Presentation Rooms</i> are currently not working on strange network setups.</p>
          </Grid.Column>
          <Grid.Column width={8}>
            <Button icon labelPosition="left" onClick={this.openFAModal.bind(this)} aria-label="Create a follow along, beta"><Icon name="share alternate" size="large"/> Follow Along</Button>
            <br/><br/>
            <p style={{textAlign: 'justify'}}>This will create two links with wich you can schedule a <i>Follow Along</i> and invite attendees before hand. <i>Follow Alongs</i> only support to share the presentation progress, but not your voice. A follow along may only be used if everyone is in the same room.</p>
          </Grid.Column>
        </Grid>;
        if(process.env.BROWSER){
            e.preventDefault();
            swal({
                titleText: 'Choose a session type',
                html: '<div id="session-modal"></div>',
                showCancelButton: true,
                cancelButtonText: 'Close',
                showConfirmButton: false,
                allowOutsideClick: false,
                width: '40rem',
                onOpen: () => {
                    ReactDOM.render(modalContent, document.getElementById('session-modal'));
                }
            }).catch((e) => {return true;});
        }
    }

    openPRModal(){
        swal({
            titleText: 'Please enter a room name',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Next',
            allowOutsideClick: false
        }).then((result) => {
            if(!isEmpty(result.dismiss)){
                return;
            } else if (!isEmpty(result.value))
                window.open('/presentationbroadcast?room=' + result.value + '&presentation=' + this.getPresentationHref().replace('#', '%23'));
            else
              swal({title: 'Please enter a valid room name', showConfirmButton: false, timer: 2000});
        }).catch((e) => {return true;});
    }

    openFAModal(){
        swal({
            titleText: 'Follow Along links & instructions',
            html: '<div id="session-modal"></div>',
            confirmButtonText: 'Okay',
            allowOutsideClick: false,
            width: '50rem',
            onOpen: () => {
                swal.showLoading();
                $.get(Microservices.webrtc.uri + '/token').done((data) => {
                    console.log(data);
                    let masterLink = window.location.origin + this.getPresentationHref() + '?id=' + data.socketId + '&secret=' + data.secret;
                    let slaveLink = window.location.origin + this.getPresentationHref() + '?id=' + data.socketId;
                    let modalContent = <div id='masterSlaveText'>
                      <p>This is the URL for the presenter of the <i>Follow Along</i>. Only the presenter should use this URL and keep it secret.</p>
                      <Input id='masterLinkInput' fluid defaultValue={masterLink} labelPosition='right' label={<Button id='masterLink' icon onClick={copyURLToClipboardAndIndicate.bind(this, masterLink, '#masterLink')}> <Icon.Group> <Icon name='clipboard outline' /><Icon corner name='arrow left' /></Icon.Group></Button>} onClick={() => $('#masterLinkInput').select()}/>
                      <br/>
                      <p>This is the URL intended for sharing the <i>Follow Along</i> with others. This URL may be published.</p>
                      <Input id='slaveLinkInput' fluid defaultValue={slaveLink} labelPosition='right' label={<Button id='slaveLink' icon onClick={copyURLToClipboardAndIndicate.bind(this, slaveLink, '#slaveLink')}> <Icon.Group> <Icon name='clipboard outline' /><Icon corner name='arrow left' /></Icon.Group></Button>} onClick={() => $('#slaveLinkInput').select()}/>
                      <br/>
                      <p>Please keep both URLs safe until you finished your session. If a URL is lost you must create a new URL pair, as these URLs must match each other.</p>
                    </div>;
                    ReactDOM.render(modalContent, document.getElementById('session-modal'));
                    swal.hideLoading();
                }).fail((jqXHR, textStatus, error) => {
                    console.log(textStatus);
                });
            }
        }).catch((e) => {return true;});

        function copyURLToClipboardAndIndicate(link, selector) {
            let text = 'Copied!';
            if(!copyURLToClipboard(link))
                text = 'Please copy manually!';
            $(selector).popup({content: text, movePopup: false, on: 'manual', hoverable: true, closable: false, hideOnScroll: false, boundary: '#masterSlaveText', position: 'left center'});
            $(selector).popup('show');
            this.timeout = setTimeout(() => {
                $(selector).popup('hide');
            }, 2000);
        }

        function copyURLToClipboard(href) {
            let toCopy = document.createElement('input');
            toCopy.style.position = 'fixed';
            toCopy.style.top = 0;
            toCopy.style.left = 0;
            toCopy.style.width = '2em';
            toCopy.style.height = '2em';
            toCopy.style.padding = 0;
            toCopy.style.border = 'none';
            toCopy.style.outline = 'none';
            toCopy.style.boxShadow = 'none';
            toCopy.style.background = 'transparent';
            toCopy.value = href;
            document.body.appendChild(toCopy);
            toCopy.value = href;
            toCopy.select();

            try {
                let successful = document.execCommand('copy');
                if(!successful)
                    return false;
                else
                    return true;
            } catch (err) {
                console.log('Oops, unable to copy');
                return false;
            } finally {
                document.body.removeChild(toCopy);
            }
        }
    }



    renderItem(index, key) {
        let url = '/presentationbroadcast?room='+this.props.ActivityFeedStore.presentations[index].roomName+'&presentation=/Presentation/'+this.props.ActivityFeedStore.selector.sid;
        return (
            <div className="ui item" key={key}>
              <Icon name="record" size="large"/><strong>
              <a target="_blank" href={url} rel="nofollow">  {this.props.ActivityFeedStore.presentations[index].roomName} (opened at {new Date(this.props.ActivityFeedStore.presentations[index].openingTime).toLocaleTimeString()})</a></strong>
            </div>
        );
    }

    render() {
        const panelDIVStyles = {
            maxHeight: 280,
            overflowY: 'auto'
        };

        return (
            <div ref="presentationPanel">
                <Icon name="warning sign" color="yellow"/><span className="ui small header" tabIndex="0"> Beta feature</span>
                <div className="ui basic segment" style={panelDIVStyles}>
                    <Grid columns={2}>
                      <Grid.Column width={4}>
                        <Popup trigger={<Button icon onClick={this.openChooseASessionModal.bind(this)} aria-label="Create a live session, Beta"><Icon name="record" size="large"/></Button>} content='Create a live session (beta)' />
                      </Grid.Column>
                      <Grid.Column width={12}>
                        Create a live session for this deck and invite participants
                      </Grid.Column>
                    </Grid>
                    <Divider />
                    <h5 className="ui small header" tabIndex="0">Live Sessions</h5>
                    <div ref="presentationList">
                        {(this.props.ActivityFeedStore.presentations.length < 1)
                            ?
                            <div>There are currently no live sessions for this deck</div>
                            :
                            <ReactList ref="infiniteList" className="ui list"
                                itemRenderer={this.renderItem.bind(this)}
                                length={this.props.ActivityFeedStore.presentations.length}
                                type={'simple'}>
                            </ReactList>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

PresentationsPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
PresentationsPanel = connectToStores(PresentationsPanel, [ActivityFeedStore, ContentStore], (context, props) => {
    return {
        ActivityFeedStore: context.getStore(ActivityFeedStore).getState(),
        ContentStore: context.getStore(ContentStore).getState()
    };
});
export default PresentationsPanel;
