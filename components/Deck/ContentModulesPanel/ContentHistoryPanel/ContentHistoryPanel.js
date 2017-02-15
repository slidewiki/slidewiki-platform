import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentHistoryStore from '../../../../stores/ContentHistoryStore';
import ContentHistoryList from './ContentHistoryList';
import UserProfileStore from '../../../../stores/UserProfileStore';
import RevisioningStore from '../../../../stores/RevisioningStore';

class ContentHistoryPanel extends React.Component {
    render() {
        return (
            <div ref="contentHistoryPanel" className="ui">
                <div>
                    <ContentHistoryList revisions={this.props.ContentHistoryStore.history} allowRevert={this.props.UserProfileStore.userid && !this.props.RevisioningStore.status.needs_revision} selector={this.props.ContentHistoryStore.selector}/>
                </div>
            </div>
        );
    }
}

ContentHistoryPanel = connectToStores(ContentHistoryPanel, [ContentHistoryStore, UserProfileStore, RevisioningStore], (context, props) => {
    return {
        ContentHistoryStore: context.getStore(ContentHistoryStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        RevisioningStore: context.getStore(RevisioningStore).getState()
    };
});
export default ContentHistoryPanel;
