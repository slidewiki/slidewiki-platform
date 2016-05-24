import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserNotificationsStore from '../../../stores/UserNotificationsStore';
import UserNotificationsList from './UserNotificationsList';
import updateUserNotificationsVisibility from '../../../actions/user/updateUserNotificationsVisibility';
import markAsReadUserNotifications from '../../../actions/user/markAsReadUserNotifications';

class UserNotificationsPanel extends React.Component {
    handleSettingsClick() {

    }

    handleChangeToggle(type, id) {
        this.context.executeAction(updateUserNotificationsVisibility, {
            changedType: type,
            changedId: id
        });
    }

    handleMarkAsRead() {
        this.context.executeAction(markAsReadUserNotifications, {

        });
    }

    render() {
        //Create subscription lists
        const subscriptions = this.props.UserNotificationsStore.subscriptions;
        const userSubscriptionList = subscriptions.map((s, index) => {
            if (s.type === 'user')
                return (
                    <div className="ui item toggle checkbox" key={index} >
                        <input name="toggleCheckbox" type="checkbox" defaultChecked={s.selected} onChange={this.handleChangeToggle.bind(this, s.type, s.id)} />
                        <label><a className="user" href={'/' + s.type + '/' + s.id}>{s.name}</a></label>
                    </div>
                );
        });
        const slideSubscriptionList = subscriptions.map((s, index) => {
            if (s.type === 'slide')
                return (
                    <div className="ui item toggle checkbox" key={index} >
                        <input name="toggleCheckbox" type="checkbox" defaultChecked={s.selected} onChange={this.handleChangeToggle.bind(this, s.type, s.id)} />
                        <label><a className="user" href={'/' + s.type + '/' + s.id}>{s.name}</a></label>
                    </div>
                );
        });
        const deckSubscriptionList = subscriptions.map((s, index) => {
            if (s.type === 'deck')
                return (
                    <div className="ui item toggle checkbox" key={index} >
                        <input name="toggleCheckbox" type="checkbox" defaultChecked={s.selected} onChange={this.handleChangeToggle.bind(this, s.type, s.id)} />
                        <label><a className="user" href={'/' + s.type + '/' + s.id}>{s.name}</a></label>
                    </div>
                );
        });

        const notifications = this.props.UserNotificationsStore.notifications;
        const selector = this.props.UserNotificationsStore.selector;

        let iconMarkAsRead = (//disabled icon
            <a className="item">
                <i className="ui large disabled checkmark box icon"></i>
            </a>
        );
        if(this.props.UserNotificationsStore.newNotificationsCount > 0) {//if there are new notifications -> enable it
            iconMarkAsRead = (
              <a className="item" onClick={this.handleMarkAsRead.bind(this)} >
                  <i className="ui large checkmark box icon"></i>
              </a>
            );
        };
        // const hrefPath = '/notifications/' + this.props.UserNotificationsStore.selector.uid;
        return (
            <div ref="userNotificationsPanel">
                <div className="ui top attached secondary pointing menu">
                    <a className="item active" href="/notifications/57">User notifications<span className="ui mini label">{this.props.UserNotificationsStore.newNotificationsCount}</span></a>
                    {/*<a className="item active" href={hrefPath}>Activity Feed</a>*/}

                    <div className="menu">
                        <a className="item" onClick={this.handleSettingsClick.bind(this)}>
                            <i className="ui large settings icon" />
                        </a>
                        <div className="mark-read-icon">
                            {iconMarkAsRead}
                        </div>
                    </div>
                </div>

                <div className="ui grid">
                    <div className="five wide column">
                        <div className="ui basic segment">
                            <h4 className="ui header">Show notifications for:</h4>
                            <label>Users:</label>
                            <div className="subscriptions">
                                <div ref="subscriptionslist">
                                    <div className="ui relaxed list">
                                        {userSubscriptionList}
                                    </div>
                                 </div>
                            </div>
                            <label>Slides:</label>
                            <div className="subscriptions">
                                <div ref="subscriptionslist">
                                    <div className="ui relaxed list">
                                        {slideSubscriptionList}
                                    </div>
                                 </div>
                            </div>
                            <label>Decks:</label>
                            <div className="subscriptions">
                                <div ref="subscriptionslist">
                                    <div className="ui relaxed list">
                                        {deckSubscriptionList}
                                    </div>
                                 </div>
                            </div>
                        </div>
                    </div>
                    <div className="ten wide column">
                        <div className="ui basic segment">
                            <UserNotificationsList items={notifications} selector={selector} />
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
UserNotificationsPanel = connectToStores(UserNotificationsPanel, [UserNotificationsStore], (context, props) => {
    return {
        UserNotificationsStore: context.getStore(UserNotificationsStore).getState()
    };
});
export default UserNotificationsPanel;
