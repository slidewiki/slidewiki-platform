import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentUsageStore from '../../../../stores/ContentUsageStore';
import ContentUsageList from './ContentUsageList';

class ContentUsagePanel extends React.Component {

    render() {
        return (
        <div ref="contentUsagePanel" className="ui">
            <div>
                <ContentUsageList usage={this.props.ContentUsageStore.usage}
                                  selector={this.props.ContentUsageStore.selector}/>
            </div>
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