import PropTypes from 'prop-types';
import React from 'react';
import slugify from 'slugify';
import {connectToStores} from 'fluxible-addons-react';
import {Button, Icon, Modal, Header, Form, Dropdown, Segment, TextArea} from 'semantic-ui-react';
import deleteFollowing from '../../../actions/following/deleteFollowing';
import FocusTrap from 'focus-trap-react';
import UserFollowingsStore from '../../../stores/UserFollowingsStore';

class FollowingModal extends React.Component {
    handleClose(){
        this.props.handleClose();
    }

    handleUnsubscribe(following) {
        this.context.executeAction(deleteFollowing, {
            id: following.id
        });
    }

    render() {
        let deckFollowings = this.props.UserFollowingsStore.deckFollowings;
        let playlistFollowings = this.props.UserFollowingsStore.playlistFollowings;
        let deckContent = (this.props.UserFollowingsStore.loading) ? '' : (this.props.UserFollowingsStore.deckFollowings.length === 0) ? <div className="ui center aligned basic segment">You are not subscribed to any decks. </div> : deckFollowings.map( (fol) => {
            let slug = fol.title && slugify(fol.title).toLowerCase() || '_';
            return (
                <div key={fol.id} className="ui vertical segment">
                    <div className="ui two column stackable grid container">
                        <div className="column">
                            <div className="ui header"><h4><a href={['/deck', fol.followed_id, slug,].join('/')} target='_blank'>{fol.title}</a></h4></div>
                            <div className="meta">{fol.description} {(fol.description) ? '\u00b7' : ''} Owner: <a href={'/user/' + fol.userName} target='_blank'>{fol.displayName || fol.userName}</a> </div>
                        </div>
                        <div className="right aligned column">
                            <div>
                                <button className="ui large basic icon button" data-tooltip={'Unsubscribe from "' + fol.title + '"'} aria-label={'Unsubscribe from ' + fol.title} name={fol.id}  onClick={this.handleUnsubscribe.bind(this, fol)} >
                                    <i className="remove icon" ></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        let playlistContent = (this.props.UserFollowingsStore.loading) ? '' : (this.props.UserFollowingsStore.playlistFollowings.length === 0) ?  <div className="ui center aligned basic segment">You are not subscribed to any playlists.</div> : playlistFollowings.map( (fol) => {
            return (
                <div key={fol.id} className="ui vertical segment">
                    <div className="ui two column stackable grid container">
                        <div className="column">
                            <div className="ui header"><h4><a href={`/playlist/${fol.followed_id}?sort=order`} target='_blank'>{fol.title}</a></h4></div>
                            <div className="meta">{fol.description} {(fol.description) ? '\u00b7' : ''} {fol.decksLength} {(fol.decksLength === 1) ? 'deck' : 'decks'} </div>
                        </div>
                        <div className="right aligned column">
                            <div>
                                <button className="ui large basic icon button" data-tooltip={'Unsubscribe from "' + fol.title + '"'} aria-label={'Unsubscribe from ' + fol.title} name={fol.id}  onClick={this.handleUnsubscribe.bind(this, fol)} >
                                    <i className="remove icon" ></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
        return (
            <Modal
                id="FollowingModal"
                dimmer='blurring'
                role='dialog'
                aria-labelledby='followingModalHeader'
                aria-describedby='followingDescription'
                aria-hidden = {!this.props.isOpen}
                tabIndex="0"
                size='small' 
                open={this.props.isOpen}
                onClose={this.props.handleClose}>
                <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}} active={this.props.isOpen} className="dialog">
                    <Modal.Header className="ui center aligned" as="h2" id="followingModalHeader">
                        Manage decks and playlist subscriptions
                    </Modal.Header>
                    <Modal.Content>
                        <div style={{'textAlign':'center'}} id="followingDescription"> Change your subscriptions. Activities for your subscribed decks and playlists appear in your notifications.</div>
                        <div className="ui hidden divider" />
                        <h3 className="ui centered header">Subscribed decks</h3>
                        <br/>
                        {deckContent}
                        <div className="ui hidden divider" />
                        <h3 className="ui centered header">Subscribed playlists</h3>
                        <br/>
                        {playlistContent}
                        <div className="ui hidden divider" />
                    </Modal.Content>
                    <TextArea className="sr-only" id="FollowingDescription" value="Subscribed to decks and playlists" tabIndex ='-1'/>
                    <Modal.Actions>
                        <Segment basic textAlign="center">
                            <div>
                                <Button as='button' onClick={this.handleClose.bind(this)} tabIndex='1'><Icon name='close'/>Close</Button>
                            </div>
                        </Segment>
                    </Modal.Actions>
                </FocusTrap>
            </Modal>
        );
    }
}

FollowingModal.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

FollowingModal = connectToStores(FollowingModal,[UserFollowingsStore],(context,props) => {
    return {
        UserFollowingsStore: context.getStore(UserFollowingsStore).getState()
    };
});

export default FollowingModal;
