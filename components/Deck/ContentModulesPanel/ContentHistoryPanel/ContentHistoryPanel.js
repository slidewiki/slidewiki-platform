import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentHistoryStore from '../../../../stores/ContentHistoryStore';
import ContentHistoryList from './ContentHistoryList';

class ContentHistoryPanel extends React.Component {
    render() {
        return (
            <div ref="contentHistoryPanel" className="ui">
                <div>
                    <ContentHistoryList revisions={this.props.ContentHistoryStore.history} selector={this.props.ContentHistoryStore.selector}/>
                </div>
            </div>
        );
    }
}

ContentHistoryPanel = connectToStores(ContentHistoryPanel, [ContentHistoryStore], (context, props) => {
    return {
        ContentHistoryStore: context.getStore(ContentHistoryStore).getState()
    };
});
export default ContentHistoryPanel;
