import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentUsageStore from '../../../../stores/ContentUsageStore';

class ContentUsagePanel extends React.Component {
    render() {
        return (
            <div ref="contentUsagePanel" className="ui">
                Usage related to {this.props.ContentUsageStore.selector.stype} #{this.props.ContentUsageStore.selector.sid}.
                <br/>
                <NavLink href={'/usage/' + this.props.ContentUsageStore.selector.stype + '/' + this.props.ContentUsageStore.selector.sid}>{'/usage/' + this.props.ContentUsageStore.selector.stype + '/' + this.props.ContentUsageStore.selector.sid}</NavLink>
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
