import React from 'react';
import ReactDOM from 'react-dom';
import ReactList from 'react-list';
import { NavLink } from 'fluxible-router';
import { Icon, Button, Popup, Grid, Divider, Input, Segment} from 'semantic-ui-react';

import { connectToStores } from 'fluxible-addons-react';
import ContentStore from '../../../stores/ContentStore';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';

import { isEmpty } from '../../../common';
import { makeNodeURL } from '../../common/Util';
import { isLocalStorageOn } from '../../../common.js';
import { Microservices } from '../../../configs/microservices';

class PresentationsPanel extends React.Component {

    openChooseASessionModal(e){
        let modalContent = <Grid columns={1} divided="vertically" padded>
          <Grid.Row>
            <h3>Presentation Room</h3>
            <p style={{textAlign: 'left'}}>Broadcast your slides to attendees in other locations. Attendees will hear your voice and be able to send you messages.</p>
            <p style={{textAlign: 'left'}}>The Presentation Room will open a new tab. Presentation Rooms are public and listed on the deck. You will also see an link to invite attendees. You should test this feature before sharing your room as network security may prevent others from accessing it.</p>
            <div style={{width: '100%'}}><Button icon labelPosition="left" floated='right' size='large' onClick={this.openPRModal.bind(this)} aria-label="Create a presentation room, beta"><Icon name="record" size="large"/> Presentation Room</Button></div>
          </Grid.Row>
          <Grid.Row>
            <h3>Follow Along</h3>
            <p style={{textAlign: 'left'}}>Attendees can Follow Along with your slides on their own device when on the same network as slides will be synced to the presenter’s display. You will be provided with two links - a Presenters Link and an Attendees link to share beforehand.</p>
            <div style={{width: '100%'}}><Button icon labelPosition="left" floated='right' size='large' onClick={this.openFAModal.bind(this)} aria-label="Create a follow along, beta"><Icon name="share alternate" size="large"/> Follow Along</Button></div>
          </Grid.Row>
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
        }).then((roomName) => {
            if (!isEmpty(roomName)){
                let presentationURL = makeNodeURL(this.props.ContentStore.selector, 'presentation', undefined, undefined, undefined);
                window.open('/presentationbroadcast?room=' + roomName + '&presentation=' + presentationURL.replace('#', '%23'));
            } else
              swal({title: 'Please enter a valid room name', showConfirmButton: false, timer: 2000}).catch(() => {return true;});
        }).catch((e) => {return true;});
    }

    openFAModal(){
        swal({
            titleText: 'Follow Along links',
            html: '<div id="session-modal"></div>',
            confirmButtonText: 'Done',
            allowOutsideClick: false,
            width: '50rem',
            onOpen: () => {
                swal.showLoading();
                $.get(Microservices.webrtc.uri + '/token').done((data) => {
                    let presentationURL = makeNodeURL(this.props.ContentStore.selector, 'presentation', undefined, undefined, undefined);
                    let masterLink = window.location.origin + presentationURL + '?id=' + data.socketId + '&secret=' + data.secret;
                    let slaveLink = window.location.origin + presentationURL + '?id=' + data.socketId;
                    let modalContent = <div id='masterSlaveText'>
                      <Segment color='grey' inverted style={{textAlign: 'left'}}><h3>Presenter Link</h3></Segment>
                      <Input id='masterLinkInput' fluid defaultValue={masterLink} labelPosition='right' label={<Button id='masterLink' icon onClick={copyURLToClipboardAndIndicate.bind(this, masterLink, '#masterLink')} aria-label="Copy presenter link to clipboard"> <Icon.Group> <Icon name='clipboard outline' /><Icon corner name='arrow left' /></Icon.Group></Button>} onClick={() => $('#masterLinkInput').select()}/>
                      <br/>
                      <Segment color='grey' inverted style={{textAlign: 'left'}}><h3>Attendees Link</h3></Segment>
                      <Input id='slaveLinkInput' fluid defaultValue={slaveLink} labelPosition='right' label={<Button id='slaveLink' icon onClick={copyURLToClipboardAndIndicate.bind(this, slaveLink, '#slaveLink')} aria-label="Copy attendees link to clipboard"> <Icon.Group> <Icon name='clipboard outline' /><Icon corner name='arrow left' /></Icon.Group></Button>} onClick={() => $('#slaveLinkInput').select()}/>
                      <br/>
                      <Segment color='red' inverted tertiary style={{textAlign: 'left', color: 'black !important'}}>Keep a copy of both links until you have finished your session. If you loose either links, you must create a new pair of links.</Segment>
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

        let toReturn;
        if(this.props.deckPage)
            toReturn = <Button icon size="huge" aria-label="Start Live Presentation" data-tooltip="Start Live Presentation" role="button" onClick={this.openChooseASessionModal.bind(this)}>
                <Icon name="record" />
            </Button>;
        else
            toReturn = <div ref="presentationPanel">
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
            </div>;

        return (<div>
            {toReturn}
            </div>
        );
    }
}

PresentationsPanel = connectToStores(PresentationsPanel, [ActivityFeedStore, ContentStore], (context, props) => {
    return {
        ActivityFeedStore: context.getStore(ActivityFeedStore).getState(),
        ContentStore: context.getStore(ContentStore).getState(),
    };
});

export default PresentationsPanel;
