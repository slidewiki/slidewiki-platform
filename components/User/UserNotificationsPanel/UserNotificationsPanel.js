import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import UserNotificationsStore from '../../../stores/UserNotificationsStore';
import UserProfileStore from '../../../stores/UserProfileStore';
import UserFollowingsStore from '../../../stores/UserFollowingsStore';
import UserNotificationsList from './UserNotificationsList';
import updateUserNotificationsVisibility from '../../../actions/user/notifications/updateUserNotificationsVisibility';
import markAsReadUserNotifications from '../../../actions/user/notifications/markAsReadUserNotifications';
import deleteAllUserNotifications from '../../../actions/user/notifications/deleteAllUserNotifications';
import loadUserNotifications from '../../../actions/user/notifications/loadUserNotifications';
import loadFollowings from '../../../actions/following/loadFollowings';
import selectAllActivityTypes from '../../../actions/user/notifications/selectAllActivityTypes';
import FollowingsModal from './FollowingsModal';
import {Button} from 'semantic-ui-react';
import setDocumentTitle from '../../../actions/setDocumentTitle';

let MediaQuery = require ('react-responsive');

class UserNotificationsPanel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showFollowingsModal: false
        };
    }

    handleClickOnFollowingsSetting() {
        this.setState({
            showFollowingsModal: true
        });
    }

    componentWillMount() {
        if ((String(this.props.UserProfileStore.userid) === '')) {//the user is not loggedin
            this.context.executeAction(navigateAction, {
                url: '/'
            });
        } else {
            this.context.executeAction(loadUserNotifications, { uid: this.props.UserProfileStore.userid });
            this.context.executeAction(loadFollowings, { userId: this.props.UserProfileStore.userid });
        }
    }

    componentDidMount() {
        $('.ui.accordion').accordion();

        this.context.executeAction(setDocumentTitle, { 
            title: this.context.intl.formatMessage({
                id: 'userNotifications.title',
                defaultMessage: 'User notifications'
            })
        });
    }

    handleChangeToggle(type, id) {
        this.context.executeAction(updateUserNotificationsVisibility, {
            changedType: type,
            changedId: id
        });
        //set value of selectAll
        let value = true;
        this.props.UserNotificationsStore.activityTypes.forEach((at) => {if (! $('#' + at.type).prop('checked')) value = false;});
        $('#all').prop('checked', value);
    }

    handleChangeAll() {
        let value = $('#all').prop('checked');
        this.props.UserNotificationsStore.activityTypes.forEach((at) => {$('#' + at.type).prop('checked', value);});
        this.context.executeAction(selectAllActivityTypes, {
            value: value
        });
    }

    handleMarkAsRead() {
        this.context.executeAction(markAsReadUserNotifications, {
            uid: this.props.UserProfileStore.userid
        });
    }

    handleDelete() {
        swal({
            title: 'Delete all notifications. Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete!'
        }).then((accepted) => {
            this.context.executeAction(deleteAllUserNotifications, {
                uid: this.props.UserProfileStore.userid
            });
        }, (reason) => {/*do nothing*/}).catch(swal.noop);
    }

    render() {
        if (String(this.props.UserProfileStore.userid) === '') {//user is not loggedin
            return null;
        }

        const activityTypeList = this.props.UserNotificationsStore.activityTypes.map((at, index) => {

            const labelName = (at.type === 'react') ? 'Like' : at.type;
            const label = labelName.charAt(0).toUpperCase() + labelName.slice(1);
            return (
                <div className="ui item toggle checkbox" key={index} role="listitem" tabIndex="0">
                    <input name={at.type} id={at.type} type="checkbox" defaultChecked={at.selected} onChange={this.handleChangeToggle.bind(this, at.type, 0)} />
                    <label>{label}</label>
                </div>
            );
        });

        const notifications = this.props.UserNotificationsStore.notifications;
        const notificationsCount = this.props.UserNotificationsStore.notifications ? this.props.UserNotificationsStore.notifications.length : 0;
        const newNotificationsCount = this.props.UserNotificationsStore.newNotificationsCount;
        const selector = this.props.UserNotificationsStore.selector;

        const buttonMarkAsReadDisabled = newNotificationsCount === 0;
        const buttonDeleteAllDisabled = notificationsCount === 0;
        const buttonMarkAsReadTitle = (newNotificationsCount > 1) ? 'Mark all ' + newNotificationsCount + ' new notifications as read' : 'Mark all new notifications as read';
        const buttonDeleteAllTitle = (notificationsCount > 1) ? 'Delete all ' + notificationsCount + ' notifications' : 'Delete all notifications';
        let noOfDecks = (this.props.UserFollowingsStore.deckFollowings) ? this.props.UserFollowingsStore.deckFollowings.length : '';
        let noOfPlaylists = (this.props.UserFollowingsStore.playlistFollowings) ? this.props.UserFollowingsStore.playlistFollowings.length : '';
        let followingDisplay = (this.props.UserFollowingsStore.loading) ? 'You are subscribed to   decks and   playlists      ' : 'You are subscribed to ' + noOfDecks + ' ' + ((noOfDecks > 1) ? 'decks' : 'deck' ) + ' and ' + noOfPlaylists + ' ' + ((noOfPlaylists > 1) ? 'playlists' : 'playlist') + '      ';

        let buttons = (
            <Button.Group basic >
                <Button disabled={buttonMarkAsReadDisabled} aria-label='Mark all as read' onClick={this.handleMarkAsRead.bind(this)}  data-tooltip={buttonMarkAsReadTitle}>
                    <i className="icons large">
                        <i className="check square outline icon" ></i>
                        <i className="corner check icon"></i>
                    </i>
                </Button>
                <Button disabled={buttonDeleteAllDisabled} aria-label='Delete all' onClick={this.handleDelete.bind(this)}  data-tooltip={buttonDeleteAllTitle}>
                    <i className="icons large">
                        <i className="times circle outline icon" ></i>
                        <i className="corner remove icon"></i>
                    </i>
                </Button>
                <Button aria-label='Manage subscriptions' onClick={this.handleClickOnFollowingsSetting.bind(this)}  data-tooltip={followingDisplay} >
                    <i className="icons large">
                        <i className="setting icon" ></i>
                        <i className="corner rss icon"></i>
                    </i>
                </Button>
            </Button.Group>);

        const filters = (
            <div className="five wide column">
                <div className="ui basic segment">

                    <h4 className="ui header" id="navigation">Show activity types:</h4>
                    <div className="activityTypes">
                        <div ref="activityTypeList">
                            <div className="ui relaxed list" role="list" >
                                <div className="ui toggle checkbox">
                                    <input name="all" id="all" type="checkbox" defaultChecked={true} onChange={this.handleChangeAll.bind(this)}/>
                                    <label>Select all</label>
                                </div>
                                <div className="ui hidden divider" />
                                {activityTypeList}
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        );

        let loadingDiv = <div className="ui basic segment">
            <div className="ui active text loader">Loading</div>
        </div>;
        let emptyDiv = <div className="ui grid centered">
            <h3>There are currently no notifications.</h3>
        </div>;

        let notificationsDiv='';
        if(this.props.UserNotificationsStore.loading){
            notificationsDiv = loadingDiv;
        } else if (notifications.length === 0) {
            notificationsDiv = emptyDiv;
        } else {
            notificationsDiv = <UserNotificationsList username={this.props.UserProfileStore.username} userid={this.props.UserProfileStore.userid} items={notifications} selector={selector} />;
        }
        return (
            <div ref="userNotificationsPanel">
                <div className="ui hidden divider" />
                <div className="ui container stackable two columm grid">
                    <div className="six wide column">
                      <h1 className="ui huge header" id="main">Notifications
                          <div className="ui mini label" aria-label="number of new notifications"> {newNotificationsCount} </div>
                    </h1>
                        {buttons}
                      <div className="ui basic segment">
                          <MediaQuery minDeviceWidth={768}>
                              {filters}
                          </MediaQuery>
                          <MediaQuery maxDeviceWidth={767}>
                          <div className="ui accordion">
                              <div className="title active">
                                <i className="icon dropdown"></i>
                                Filters
                              </div>
                              <div className="content field">
                                  {filters}
                              </div>
                          </div>
                          </MediaQuery>
                      </div>
                    </div>
                    <div className="column ten wide">
                        <div className="ui basic segment">
                            {notificationsDiv}
                        </div>
                    </div>
                </div>
                <FollowingsModal isOpen={this.state.showFollowingsModal} handleClose={() => this.setState({showFollowingsModal: false})} />
            </div>
        );
    }
}

UserNotificationsPanel.contextTypes = {
    intl: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired
};
UserNotificationsPanel = connectToStores(UserNotificationsPanel, [UserNotificationsStore, UserProfileStore, UserFollowingsStore], (context, props) => {
    return {
        UserNotificationsStore: context.getStore(UserNotificationsStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        UserFollowingsStore: context.getStore(UserFollowingsStore).getState()
    };
});
export default UserNotificationsPanel;
