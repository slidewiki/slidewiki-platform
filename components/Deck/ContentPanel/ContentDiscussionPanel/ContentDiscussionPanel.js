import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentDiscussionStore from '../../../../stores/ContentDiscussionStore';

class ContentDiscussionPanel extends React.Component {
    render() {
        return (
            <div ref="contentDiscussionPanel" className="ui segment">
                Discussion related to this content come here!
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
