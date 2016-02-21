import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentHistoryStore from '../../../../stores/ContentHistoryStore';

class ContentHistoryPanel extends React.Component {
    render() {
        return (
            <div ref="contentHistoryPanel" className="ui segment">
                History related to {this.props.ContentHistoryStore.selector.stype} #{this.props.ContentHistoryStore.selector.sid}.
                <br/>
                <NavLink href={'/history/' + this.props.ContentHistoryStore.selector.stype + '/' + this.props.ContentHistoryStore.selector.sid}>{'/history/' + this.props.ContentHistoryStore.selector.stype + '/' + this.props.ContentHistoryStore.selector.sid}</NavLink>
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
