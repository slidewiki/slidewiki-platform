import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';

class ContentQuestionsPanel extends React.Component {
    render() {
        return (
            <div ref="contentQuestionsPanel" className="ui segment">
                Questions related to this content come here!
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
