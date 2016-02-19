import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentHistoryStore from '../../../../stores/ContentHistoryStore';

class ContentHistoryPanel extends React.Component {
    render() {
        return (
            <div ref="contentHistoryPanel" className="ui segment">
                History of content comes here!
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
