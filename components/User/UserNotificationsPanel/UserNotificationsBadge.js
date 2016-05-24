import React from 'react';
import { NavLink } from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import UserNotificationsStore from '../../../stores/UserNotificationsStore';
import UserNotificationsItem from './UserNotificationsItem';

class UserNotificationsBadge extends React.Component {
    componentDidMount() {
        this.enablePopup();
    }
    componentDidUpdate(){
        this.enablePopup();
    }
    enablePopup() {
        let notificationsBadge = this.refs.notificationsBadge;
        const visible = (this.props.UserNotificationsStore.newNotificationsCount > 0);
        if (visible) {
            $(notificationsBadge).popup({
                inline   : true,
                hoverable: true,
                position : 'bottom left',
                delay: {
                    show: 100,
                    hide: 300
                }
            });
        }
    }

    removePopupIfNeeded() {
        let notificationsBadge = this.refs.notificationsBadge;
        const visible = (this.props.UserNotificationsStore.newNotificationsCount > 0);
        if (!visible) {
            $(notificationsBadge).popup('destroy');
        }
    }

    render() {
        const selector = this.props.selector;

        let noNewNotificationsMessage = '';
        if (this.props.UserNotificationsStore.newNotificationsCount === 0) {
            noNewNotificationsMessage = (<span><i className="ui big check circle outline icon" />No more new notifications.</span>);
        }
        const notifications = this.props.UserNotificationsStore.notifications;
        const list = notifications.map((notification, index) => {
            if (notification.new !== undefined && notification.new === true) {
                return (
                    <UserNotificationsItem notification={notification} key={index} selector={selector} />
                );
            }
        });

        return (
          <div onMouseOver={this.removePopupIfNeeded.bind(this)}>
              <div ref="notificationsBadge" >
                  <NavLink className="item right" routeName="notifications" navParams={{uid:57}} activeClass="active">
                      <i className="ui large flag icon" />
                        <span className="ui mini label">{this.props.UserNotificationsStore.newNotificationsCount}</span>
                  </NavLink>
              </div>
              <div id="popup" className="ui special flowing popup">
                  <div ref="userNotificationsList">
                      <NavLink routeName="notifications" navParams={{uid:57}} activeClass="active">
                          User notifications
                      </NavLink>
                      <div className="ui relaxed divided list">
                          {list}
                      </div>
                      <div >
                          {noNewNotificationsMessage}
                      </div>
                  </div>
              </div>
          </div>
        );
    }
}

UserNotificationsBadge = connectToStores(UserNotificationsBadge, [UserNotificationsStore], (context, props) => {
    return {
        UserNotificationsStore: context.getStore(UserNotificationsStore).getState()
    };
});
export default UserNotificationsBadge;
