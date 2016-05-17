import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
// import classNames from 'classnames/bind';
// import loadActivities from '../../../actions/activityfeed/loadActivities';

// import UserNotificationsStore from '../../../stores/UserNotificationsStore';
// import UserNotificationsList from './UserNotificationsList';

class UserNotificationsPanel extends React.Component {

    render() {
        // const hrefPath = '/notifications/' + this.props.UserNotificationsStore.selector.uid;
        return (
            <div ref="activityFeedPanel">
                <div className="ui top attached secondary pointing menu">
                    <a className="item active" href="/notifications/57">User notifications</a>
                    {/*<a className="item active" href={hrefPath}>Activity Feed</a>*/}

                    <div className="right menu">
                      <div className="item">
                        <div className="ui icon input">
                            <input type="text" placeholder="Search in notifications..." />
                            <i className="search link icon"></i>
                        </div>
                      </div>
                    </div>
                </div>
                <div className="ui segment attached">
                    {/*<UserNotificationsList  />*/}
                </div>

            </div>
        );
    }
}

UserNotificationsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
// UserNotificationsPanel = connectToStores(UserNotificationsPanel, [UserNotificationsStore], (context, props) => {
//     return {
//         UserNotificationsStore: context.getStore(UserNotificationsStore).getState()
//     };
// });
export default UserNotificationsPanel;
