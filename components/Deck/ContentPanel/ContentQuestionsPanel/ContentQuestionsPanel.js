import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';

class ContentQuestionsPanel extends React.Component {
    render() {
        return (
            <div ref="contentQuestionsPanel" className="ui bottom attached segment">
                Questions related to {this.props.ContentQuestionsStore.selector.stype} #{this.props.ContentQuestionsStore.selector.sid}.
                <br/>
                <NavLink href={'/questions/' + this.props.ContentQuestionsStore.selector.stype + '/' + this.props.ContentQuestionsStore.selector.sid}>{'/questions/' + this.props.ContentQuestionsStore.selector.stype + '/' + this.props.ContentQuestionsStore.selector.sid}</NavLink>
            </div>
        );
    }
}

ContentQuestionsPanel = connectToStores(ContentQuestionsPanel, [ContentQuestionsStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState()
    };
});
export default ContentQuestionsPanel;
