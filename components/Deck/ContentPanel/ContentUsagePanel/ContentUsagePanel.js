import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentUsageStore from '../../../../stores/ContentUsageStore';

class ContentUsagePanel extends React.Component {
    render() {
        return (
            <div ref="contentUsagePanel" className="ui segment">
                Usage of content comes here!
            </div>
        );
    }
}

ContentUsagePanel = connectToStores(ContentUsagePanel, [ContentUsageStore], (context, props) => {
    return {
        ContentUsageStore: context.getStore(ContentUsageStore).getState()
    };
});
export default ContentUsagePanel;
