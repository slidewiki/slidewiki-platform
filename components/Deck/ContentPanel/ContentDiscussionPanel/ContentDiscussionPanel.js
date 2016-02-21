import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentDiscussionStore from '../../../../stores/ContentDiscussionStore';

class ContentDiscussionPanel extends React.Component {
    render() {
        return (
            <div ref="contentDiscussionPanel" className="ui segment">
                Discussion related to {this.props.ContentDiscussionStore.selector.stype} #{this.props.ContentDiscussionStore.selector.sid}.
                <br/>
                <NavLink href={'/discussion/' + this.props.ContentDiscussionStore.selector.stype + '/' + this.props.ContentDiscussionStore.selector.sid}>{'/discussion/' + this.props.ContentDiscussionStore.selector.stype + '/' + this.props.ContentDiscussionStore.selector.sid}</NavLink>
            </div>
        );
    }
}

ContentDiscussionPanel = connectToStores(ContentDiscussionPanel, [ContentDiscussionStore], (context, props) => {
    return {
        ContentDiscussionStore: context.getStore(ContentDiscussionStore).getState()
    };
});
export default ContentDiscussionPanel;
