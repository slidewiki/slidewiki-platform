import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import SlideContentEditor from './SlideContentEditor';
import restoreDeckPageLayout from '../../../../../actions/deckpagelayout/restoreDeckPageLayout';



class SlideEditPanel extends React.Component {
    componentWillUnmount(){
        //show deckTree again
        context.executeAction(restoreDeckPageLayout,{});

    }

    render() {
        //handle the notifications --> in process.env.BROWSER
        let self = this;
        //-------------------------------------------------------
        let editorcontent = '';
        // Only load WYSIWYG-Editor when the content has been loaded via loadSlideEdit.js
        if (this.props.SlideEditStore.content !== ''){
            editorcontent = <SlideContentEditor title={this.props.SlideEditStore.title}
                                                content={this.props.SlideEditStore.content}
                                                id={this.props.SlideEditStore.id}
                                                speakernotes={this.props.SlideEditStore.speakernotes}
                                                selector={this.props.selector} />;
        }
        return (
            <div ref="slideEditPanel" className="ui bottom attached segment">
                {editorcontent}
            </div>
        );
    }
}

SlideEditPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

SlideEditPanel = connectToStores(SlideEditPanel, [SlideEditStore, UserProfileStore], (context, props) => {
    return {
        SlideEditStore: context.getStore(SlideEditStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default SlideEditPanel;
