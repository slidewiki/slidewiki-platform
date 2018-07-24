import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import ContentStore from '../../../stores/ContentStore';
import {isLocalStorageOn} from '../../../common.js';
import ReactList from 'react-list';
import { Icon, Button, Popup, Grid, Divider} from 'semantic-ui-react';

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
            <p>This will immediately create a presentation room, redirect you to the room and hand you a link to invite other people. Attendees will hear your voice, have a one way chat as well as a live subtitle. Such rooms are always public and listed at the deck.</p>
          </Grid.Column>
          <Grid.Column width={8}>
            <Button icon labelPosition="left" onClick={this.openFAModal.bind(this)} aria-label="Create a follow along, beta"><Icon name="share alternate" size="large"/> Follow Along</Button>
            <br/><br/>
            <p>This will create a link and a pin with wich you can schedule a live session and invite attendees before hand. Follow alongs only support to share the presentation progress, but not your voice. A follow along may be only used if everyone is in the same room.</p>
          </Grid.Column>
        </Grid>;
        if(process.env.BROWSER){
            e.preventDefault();
            swal({
                titleText: 'Choose a session type',
                html: '<div id="session-modal"></div>',
                showCancelButton: true,
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
            window.open('/presentationbroadcast?room=' + roomName + '&presentation=' + this.getPresentationHref().replace('#', '%23'));
        }).catch((e) => {return true;});
    }

    openFAModal(){
        swal({
            titleText: 'Follow Along credentials & instructions',
            text: '',
            showCancelButton: true,
            confirmButtonText: 'Okay',
            allowOutsideClick: false,
            width: '50rem',
            onOpen: () => {
                swal.showLoading();
                $.getJSON('https://reveal-js-multiplex-ccjbegmaii.now.sh/token').done((data) => {
                    console.log(data);
                }).fail((jqXHR, textStatus, error) => {
                    console.log(textStatus);
                });
            }
        }).catch((e) => {return true;});
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
