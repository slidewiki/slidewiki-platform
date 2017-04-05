import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentUsageStore from '../../../../stores/ContentUsageStore';
import ContentUsageList from './ContentUsageList';

class ContentUsagePanel extends React.Component {

    render() {
        const noUsageMessage = <div>There is currently no usage of
            this {this.props.ContentUsageStore.selector.stype}.</div>;
        const usageListComp = <div>
            <ContentUsageList usage={this.props.ContentUsageStore.usage}
                              selector={this.props.ContentUsageStore.selector}/></div>;
        return (
        <div ref="contentUsagePanel" className="ui">
            <div> {(this.props.ContentUsageStore.usage.length === 0) ? noUsageMessage : usageListComp}</div>
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