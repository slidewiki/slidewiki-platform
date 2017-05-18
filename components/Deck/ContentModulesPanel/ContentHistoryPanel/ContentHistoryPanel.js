import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckHistoryStore from '../../../../stores/DeckHistoryStore';
import ContentHistoryList from './ContentHistoryList';
import UserProfileStore from '../../../../stores/UserProfileStore';
import PermissionsStore from '../../../../stores/PermissionsStore';

class ContentHistoryPanel extends React.Component {
    render() {
        return (
            <div ref="contentHistoryPanel" className="ui">
                <div>
                    <ContentHistoryList revisions={this.props.DeckHistoryStore.revisions}
                                        userid={this.props.UserProfileStore.userid}
                                        selector={this.props.DeckHistoryStore.selector}
                                        permissions={this.props.PermissionsStore.permissions} />
                </div>
            </div>
        );
    }
}

ContentHistoryPanel = connectToStores(ContentHistoryPanel, [DeckHistoryStore, UserProfileStore, PermissionsStore], (context, props) => {
    return {
        DeckHistoryStore: context.getStore(DeckHistoryStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default ContentHistoryPanel;
