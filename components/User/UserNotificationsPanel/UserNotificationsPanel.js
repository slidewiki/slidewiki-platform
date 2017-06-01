import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import UserNotificationsStore from '../../../stores/UserNotificationsStore';
import UserProfileStore from '../../../stores/UserProfileStore';
import UserNotificationsList from './UserNotificationsList';
import updateUserNotificationsVisibility from '../../../actions/user/notifications/updateUserNotificationsVisibility';
import markAsReadUserNotifications from '../../../actions/user/notifications/markAsReadUserNotifications';
import loadUserNotifications from '../../../actions/user/notifications/loadUserNotifications';
import loadNewUserNotifications from '../../../actions/user/notifications/loadNewUserNotifications';

class UserNotificationsPanel extends React.Component {
    constructor() {
        super();
        this.displayEmptyText = 'Loading notifications...';
    }

    componentWillMount() {
        if ((String(this.props.UserProfileStore.userid) === '')) {//the user is not loggedin
            this.context.executeAction(navigateAction, {
                url: '/'
            });
        } else {
            this.context.executeAction(loadUserNotifications, { uid: this.props.UserProfileStore.userid });
            this.context.executeAction(loadNewUserNotifications, { uid: this.props.UserProfileStore.userid });
        }
    }

    componentWillUpdate() {
        if (this.props.UserNotificationsStore.notifications !== undefined) {
            this.displayEmptyText = 'There are currently no notifications.';
        }
    }

    // handleChangeToggle(type, id) {
    //     this.context.executeAction(updateUserNotificationsVisibility, {
    //         changedType: type,
    //         changedId: id
    //     });
    // }

    handleMarkAsRead() {
        this.context.executeAction(markAsReadUserNotifications, {
            uid: this.props.UserProfileStore.userid
        });
    }

    render() {
        if (String(this.props.UserProfileStore.userid) === '') {//user is not loggedin
            return null;
        }
        //Create subscription lists
        // const subscriptions = this.props.UserNotificationsStore.subscriptions;
        // const userSubscriptionList = subscriptions.map((s, index) => {
        //     if (s.type === 'user')
        //         return (
        //             <div className="ui item toggle checkbox" key={index} >
        //                 <input name="toggleCheckbox" type="checkbox" defaultChecked={s.selected} onChange={this.handleChangeToggle.bind(this, s.type, s.id)} />
        //                 <label><a className="user" href={'/' + s.type + '/' + s.id}>{s.name}</a></label>
        //             </div>
        //         );
        // });
        // const slideSubscriptionList = subscriptions.map((s, index) => {
        //     if (s.type === 'slide')
        //         return (
        //             <div className="ui item toggle checkbox" key={index} >
        //                 <input name="toggleCheckbox" type="checkbox" defaultChecked={s.selected} onChange={this.handleChangeToggle.bind(this, s.type, s.id)} />
        //                 <label><a className="user" href={'/' + s.type + '/' + s.id}>{s.name}</a></label>
        //             </div>
        //         );
        // });
        // const deckSubscriptionList = subscriptions.map((s, index) => {
        //     if (s.type === 'deck')
        //         return (
        //             <div className="ui item toggle checkbox" key={index} >
        //                 <input name="toggleCheckbox" type="checkbox" defaultChecked={s.selected} onChange={this.handleChangeToggle.bind(this, s.type, s.id)} />
        //                 <label><a className="user" href={'/' + s.type + '/' + s.id}>{s.name}</a></label>
        //             </div>
        //         );
        // });
        const activityTypeList = this.props.UserNotificationsStore.activityTypes.map((at, index) => {

            const labelName = (at.type === 'react') ? 'Like' : at.type;
            const label = labelName.charAt(0).toUpperCase() + labelName.slice(1);
            return (
                <div className="ui item toggle checkbox" key={index} >
                    <input name="toggleCheckbox" type="checkbox" defaultChecked={at.selected} onChange={this.handleChangeToggle.bind(this, at.type, 0)} />
                    <label>{label}</label>
                </div>
            );
        });

        const notifications = this.props.UserNotificationsStore.notifications;
        const newNotifications = this.props.UserNotificationsStore.newNotifications;
        const selector = this.props.UserNotificationsStore.selector;

        const iconMarkAsReadTitle = 'Mark all ' + newNotifications.length + ' as read';
        let iconMarkAsRead = (//disabled icon
            <a className="item" title={iconMarkAsReadTitle}>
                <i tabIndex="0" className="ui large disabled checkmark box icon"></i>
            </a>
        );
        if(newNotifications.length > 0) {//if there are new notifications -> enable it
            iconMarkAsRead = (
              <a className="item" onClick={this.handleMarkAsRead.bind(this)} title={iconMarkAsReadTitle} >
                  <i tabIndex="0" className="ui large checkmark box icon"></i>
              </a>
            );
        };
        // const hrefPath = '/notifications/' + this.props.UserNotificationsStore.selector.uid;
        const filters = (
            <div className="five wide column">
                <div className="ui basic segment">

                    <h4 className="ui header">Show activity types:</h4>
                    <div className="activityTypes">
                        <div ref="activityTypeList">
                            <div className="ui relaxed list">
                                {activityTypeList}
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        );
        // const filters = (
        //     <div className="five wide column">
        //         <div className="ui basic segment">
        //             <h4 className="ui header">Show notifications for:</h4>
        //             <label>Users:</label>
        //             <div className="subscriptions">
        //                 <div ref="subscriptionslist">
        //                     <div className="ui relaxed list">
        //                         {userSubscriptionList}
        //                     </div>
        //                  </div>
        //             </div>
        //             <label>Slides:</label>
        //             <div className="subscriptions">
        //                 <div ref="subscriptionslist">
        //                     <div className="ui relaxed list">
        //                         {slideSubscriptionList}
        //                     </div>
        //                  </div>
        //             </div>
        //             <label>Decks:</label>
        //             <div className="subscriptions">
        //                 <div ref="subscriptionslist">
        //                     <div className="ui relaxed list">
        //                         {deckSubscriptionList}
        //                     </div>
        //                  </div>
        //             </div>
        //             <h4 className="ui header">Show activity types:</h4>
        //             <div className="activityTypes">
        //                 <div ref="activityTypeList">
        //                     <div className="ui relaxed list">
        //                         {activityTypeList}
        //                     </div>
        //                  </div>
        //             </div>
        //         </div>
        //     </div>
        // );
        return (
            <div ref="userNotificationsPanel">
                <div className="ui hidden divider"></div>
                <div className="ui container stackable two columm grid">
                    <div className="six wide column">
                      <div className="ui huge header">
                          Notifications <div className="ui mini label" >{iconMarkAsRead} {newNotifications.length}</div>
                      </div><div className="ui basic segment">

                            {filters}
                        </div>
                    </div>
                    <div className="column ten wide">
                        <div className="ui basic segment">
                            {(!notifications || notifications.length === 0)
                                ?
                                <div>{this.displayEmptyText}</div>
                                :
                                <UserNotificationsList items={notifications} selector={selector} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

UserNotificationsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
UserNotificationsPanel = connectToStores(UserNotificationsPanel, [UserNotificationsStore, UserProfileStore], (context, props) => {
    return {
        UserNotificationsStore: context.getStore(UserNotificationsStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default UserNotificationsPanel;
