import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentHistoryStore from '../../../../stores/ContentHistoryStore';
import ContentHistoryList from './ContentHistoryList';
import UserProfileStore from '../../../../stores/UserProfileStore';

class ContentHistoryPanel extends React.Component {
    render() {
        return (
            <div ref="contentHistoryPanel" className="ui">
                <div>
                    <ContentHistoryList revisions={this.props.ContentHistoryStore.history} userid={this.props.UserProfileStore.userid} selector={this.props.ContentHistoryStore.selector}/>
                </div>
            </div>
        );
    }
}

ContentHistoryPanel = connectToStores(ContentHistoryPanel, [ContentHistoryStore, UserProfileStore], (context, props) => {
    return {
        ContentHistoryStore: context.getStore(ContentHistoryStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default ContentHistoryPanel;
