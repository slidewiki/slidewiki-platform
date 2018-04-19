import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import DataSourceStore from '../../../../../stores/DataSourceStore';
import SlideViewStore from '../../../../../stores/SlideViewStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import DeckTreeStore from '../../../../../stores/DeckTreeStore';
import showdown from 'showdown';
let converter = new showdown.Converter();

class MarkdownEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {markdownContent: '', htmlContent: ''};
    }
    handleChange(event) {
        if(event.target.value.trim()){
            let html = converter.makeHtml(event.target.value);
            this.setState({markdownContent: event.target.value, htmlContent: html});
        }
    }

    render() {

        return (
            <div ref='markdownEditor' id='markdownEditor'>

                <textarea onChange={this.handleChange.bind(this)}>
                    {this.state.markdownContent}
                </textarea>
                <div dangerouslySetInnerHTML={{__html: this.state.htmlContent}}>
                </div>
            </div>
        );
    }

}

MarkdownEditor.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

MarkdownEditor = connectToStores(MarkdownEditor, [SlideEditStore, UserProfileStore, DataSourceStore, SlideViewStore, DeckTreeStore], (context, props) => {

    return {
        SlideEditStore: context.getStore(SlideEditStore).getState(),
        SlideViewStore: context.getStore(SlideViewStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        DataSourceStore: context.getStore(DataSourceStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default MarkdownEditor;
