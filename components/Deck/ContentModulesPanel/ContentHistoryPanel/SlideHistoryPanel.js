import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SlideHistoryStore from '../../../../stores/SlideHistoryStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import PermissionsStore from '../../../../stores/PermissionsStore';
import {Feed} from 'semantic-ui-react';
import ContentChangeItem from './ContentChangeItem';

class SlideHistoryPanel extends React.Component {

    render() {
        const changes = this.props.SlideHistoryStore.changes ? this.props.SlideHistoryStore.changes.map((change, index) => {
            return (
            <ContentChangeItem selector={this.props.selector} permissions={this.props.PermissionsStore.permissions} change={change} key={index}/>
            );
        }) : '';

        return (
        <div ref="slideHistoryPanel" className="ui">
            <Feed>
                {changes}
            </Feed>
        </div>
        );
    }
}

SlideHistoryPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

SlideHistoryPanel = connectToStores(SlideHistoryPanel, [SlideHistoryStore, UserProfileStore, PermissionsStore], (context, props) => {
    return {
        SlideHistoryStore: context.getStore(SlideHistoryStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default SlideHistoryPanel;
