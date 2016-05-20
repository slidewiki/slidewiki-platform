import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import UserNotificationsStore from '../../../stores/UserNotificationsStore';
import UserNotificationsList from './UserNotificationsList';
import updateUserNotificationsVisibility from '../../../actions/user/updateUserNotificationsVisibility';

class UserNotificationsPanel extends React.Component {
    componentDidMount() {
        this.enableDropdown();
    }
    componentDidUpdate(){
        this.enableDropdown();
    }
    enableDropdown(status) {
        let dropdownDIV = this.refs.userNotificationsPanel;
        $(dropdownDIV).find('.ui.dropdown').dropdown({
            onChange: (value) => {





              console.log(value);





              
                this.context.executeAction(updateUserNotificationsVisibility, {
                    subscriptions: value
                });
            }
        });
    }

    handleSettingsClick() {

    }

    render() {
        const notifications = this.props.UserNotificationsStore.notifications;
        const selector = this.props.UserNotificationsStore.selector;

        // const hrefPath = '/notifications/' + this.props.UserNotificationsStore.selector.uid;
        return (
            <div ref="userNotificationsPanel">
                <div className="ui top attached secondary pointing menu">
                    <a className="item active" href="/notifications/57">User notifications</a>
                    {/*<a className="item active" href={hrefPath}>Activity Feed</a>*/}

                    <div className="menu">
                        <a className="item" onClick={this.handleSettingsClick.bind(this)}>
                            <i className="ui large settings icon" />
                        </a>
                    </div>
                </div>

                <h4 className="ui header">Show notifications for:</h4>

                <select name="subscriptions" className="ui dropdown red" multiple defaultValue={this.props.UserNotificationsStore.subscriptions}>
                    <option value={this.props.UserNotificationsStore.subscriptions[0]} >Slide: Introduction</option>
                    <option value={this.props.UserNotificationsStore.subscriptions[1]} >Deck: RDF Data Model</option>
                    <option value={this.props.UserNotificationsStore.subscriptions[2]} >User: Vuk M.</option>
                    <option value={this.props.UserNotificationsStore.subscriptions[3]} >User: Dejan P.</option>
                </select>

                <div className="ui segment">
                    <UserNotificationsList items={notifications} selector={selector} />
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
