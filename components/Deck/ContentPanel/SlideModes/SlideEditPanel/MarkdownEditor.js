import PropTypes from 'prop-types';
import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideContentView from '../SlideViewPanel/SlideContentView';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import DataSourceStore from '../../../../../stores/DataSourceStore';
import SlideViewStore from '../../../../../stores/SlideViewStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import DeckTreeStore from '../../../../../stores/DeckTreeStore';
import showdown from 'showdown';
import turndown from 'turndown';
import Util from '../../../../common/Util';
import saveSlide from '../../../../../actions/slide/saveSlide';

let converter = new showdown.Converter();
converter.setOption('tables', true);
converter.setOption('tasklists', 'true');
converter.setOption('smoothLivePreview', 'true');
converter.setOption('ghMentions', 'true');
converter.setOption('openLinksInNewWindow', 'true');
converter.setOption('emoji', 'true');
converter.setOption('underline', 'true');
converter.setOption('strikethrough', 'true');
converter.setOption('literalMidWordUnderscores', 'true');
converter.setOption('simplifiedAutoLink', 'true');
let t_converter = new turndown();

class MarkdownEditor extends React.Component {
    constructor(props) {
        super(props);
        let htmlContent = this.props.content;
        let markdownContent = this.props.markdown.trim();
        //if no markdown is provided, we can try to make an estimate
        if(htmlContent && (!markdownContent || markdownContent==='')){
            markdownContent = t_converter.turndown(htmlContent);
        }
        this.state = {markdownContent: markdownContent, htmlContent: htmlContent, title: this.props.title};
    }
    handleChange(event) {
        if(event.target.value.trim()){
            let html = converter.makeHtml(event.target.value);
            //add especial classes for Neo4j Cypher language
            html = html.replace(/<pre>(.*?)<code class="cypher language-cypher">/g, '<pre mode="cypher" class="highlight pre-scrollable code runnable standalone-example ng-binding"><code class="cypher language-cypher">');
            this.setState({markdownContent: event.target.value, htmlContent: html, title: (this.props.title === this.state.title ? this.state.title : this.props.title)});
        }
    }
    componentDidMount(){
        //to re-scale
        this.forceUpdate();
    }
    handleSaveButton(){
        if (this.props.UserProfileStore.username !== '') {
            //update store
            let title = this.props.title;
            let content = this.state.htmlContent;
            let markdown = this.state.markdownContent;
            let speakernotes = this.props.speakernotes;
            this.props.SlideEditStore.title = title;
            this.props.SlideEditStore.content = content;
            this.props.SlideEditStore.speakernotes = speakernotes;
            let currentSelector = this.props.selector;
            let deckID = currentSelector.id;
            let dataSources = (this.props.DataSourceStore.dataSources !== undefined) ? this.props.DataSourceStore.dataSources : [];
            let tags = this.props.SlideViewStore.tags? this.props.SlideViewStore: [];
            this.context.executeAction(saveSlide, {
                id: currentSelector.sid,
                deckID: deckID,
                title: title,
                content: content,
                markdown: markdown,
                speakernotes: speakernotes,
                dataSources: dataSources,
                selector: currentSelector,
                tags: tags
            });
        }
        return false;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.SlideEditStore.saveSlideClick === 'true')
        {
            this.handleSaveButton();
        }
        if (nextProps.SlideEditStore.cancelClick === 'true')
        {
            const nodeURL = Util.makeNodeURL(nextProps.SlideEditStore.selector, nextProps.SlideEditStore.selector.page, 'view');
            this.context.executeAction(navigateAction, {
                url: nodeURL
            });
        }
    }
    render() {
        return (
            <div ref='markdownEditor' id='markdownEditor' style={{minHeight: '500px'}}>
                <div className="ui stackable equal width left aligned padded grid">
                  <div className="row">
                    <div className="column form field ui">
                        <textarea rows="36" onChange={this.handleChange.bind(this)} value={this.props.title === this.state.title ? this.state.markdownContent: ((!this.props.markdown.trim() || this.props.markdown.trim() === '') && this.props.content ? t_converter.turndown(this.props.content) : this.props.markdown)}></textarea>
                    </div>
                    <div className="column">
                        <SlideContentView content={this.props.title === this.state.title ? this.state.htmlContent: this.props.content}
                        speakernotes='' hideSpeakerNotes={true} theme=''/>
                    </div>
                  </div>
                </div>
            </div>
        );
    }

}

MarkdownEditor.contextTypes = {
    executeAction: PropTypes.func.isRequired
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
