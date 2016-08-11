import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ContentHistoryStore from '../../../../stores/ContentHistoryStore';
import ContentHistoryList from './ContentHistoryList';
import Error from '../../../../components/Error/Error';

class ContentHistoryPanel extends React.Component {
    render() {
        if(this.props.ContentHistoryStore.error) {
            return (
                <div ref="contentHistoryPanel">
                    <Error error={this.props.ContentHistoryStore.error} />
                </div>
            );
        }
        else {
            return (
                <div ref="contentHistoryPanel" className="ui">
                    {/*History related to {this.props.ContentHistoryStore.selector.stype}
                    #{this.props.ContentHistoryStore.selector.sid}.
                    <br/>*/}
                    {/*<NavLink href={'/history/' + this.props.ContentHistoryStore.selector.stype + '/' + this.props.ContentHistoryStore.selector.sid}>{'/history/' + this.props.ContentHistoryStore.selector.stype + '/' + this.props.ContentHistoryStore.selector.sid}</NavLink>*/}
                    <div>
                        <ContentHistoryList items={this.props.ContentHistoryStore.history} selector={this.props.ContentHistoryStore.selector}/>
                    </div>
                </div>
            );
        }
    }
}

ContentHistoryPanel = connectToStores(ContentHistoryPanel, [ContentHistoryStore], (context, props) => {
    return {
        ContentHistoryStore: context.getStore(ContentHistoryStore).getState()
    };
});
export default ContentHistoryPanel;
