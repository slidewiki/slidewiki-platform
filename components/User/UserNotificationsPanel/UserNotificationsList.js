import React from 'react';
import UserNotificationsItem from './UserNotificationsItem';
import {List} from 'semantic-ui-react';
class UserNotificationsList extends React.Component {
    render() {
        const selector = this.props.selector;

        const list = this.props.items.map((notification, index) => {
            if (notification.visible) {
                return (
                    <UserNotificationsItem username={this.props.username} notification={notification} key={index} selector={selector} />
                );
            }
        });

        return (
            <div ref="userNotificationsList" className="ui">
                <List relaxed celled>
                    {list}
                </List>
            </div>
        );
    }
}

export default UserNotificationsList;
