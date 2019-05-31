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
import { Button, Icon, Dropdown} from 'semantic-ui-react';
import registerChange from '../../../../../actions/slide/registerChange';


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

        this.state = {
            markdownContent: markdownContent, 
            htmlContent: htmlContent, 
            title: this.props.title
        };
    }
    handleChange(event) {
        let value = this.state.markdownContent;
        if (event) {
            value = event.target.value;
        }
        this.setChanges(true);

        if(value.trim()){
            let html = converter.makeHtml(value);
            //add especial classes for Neo4j Cypher language
            html = html.replace(/<pre>(.*?)<code class="cypher language-cypher">/g, '<pre mode="cypher" class="highlight pre-scrollable code runnable standalone-example ng-binding"><code class="cypher language-cypher">');
            this.setState({markdownContent: value, htmlContent: html, title: (this.props.title === this.state.title ? this.state.title : this.props.title)});
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
    // TODO: ensure this is tested in other browsers then Chrome (probably some changes are needed for IE)
    wrapText = (openTag, closeTag = '') => {
        let textArea = this.refs.markdownTextarea;
        let len = textArea.value.length;
        let start = textArea.selectionStart;
        let end = textArea.selectionEnd;
        let selectedText = textArea.value.substring(start, end);
        let replacement = openTag + selectedText + closeTag;
        let value = textArea.value.substring(0, start) + replacement + textArea.value.substring(end, len);

        this.setState({
            markdownContent: value
        }, () => {
            // set selection when state has changed
            textArea.focus();
            textArea.setSelectionRange(start + openTag.length, end + openTag.length);
            this.handleChange();
        });
    }

    setChanges = (value) => {
        this.context.executeAction(registerChange, { hasChanges: value });
    };
    
    render() {
        const selector = this.props.selector || this.props.DeckTreeStore.selector;
        let deckTheme = selector && selector.theme;
        
        if (!deckTheme) {
            // we need to locate the slide in the DeckTreeStore.flatTree and find the theme from there
            let treeNode = this.props.DeckTreeStore.flatTree
                .find((node) => node.get('id') === this.props.SlideViewStore.slideId && node.get('type') === 'slide');

            if (treeNode) {
                deckTheme = treeNode.get('theme');
            } else {
                // pick theme from deck root as a last resort
                deckTheme = this.props.DeckTreeStore.theme;
            }
        }
        deckTheme = deckTheme ? deckTheme : ''; // no theme has been found, used empty string for the default theme
        
        return (
            <div ref='markdownEditor' id='markdownEditor' style={{minHeight: '500px'}}>
                <div className="ui stackable equal width left aligned padded grid">
                  <div className="row">
                    <div className="column form field ui">
                        <Button.Group>
                            <Dropdown button icon="heading" className="icon small" aria-label="Insert heading">
                                <Dropdown.Menu>
                                    <Dropdown.Item text='Heading 1' onClick={(e) => this.wrapText('# ')}/>
                                    <Dropdown.Item text='Heading 2' onClick={(e) => this.wrapText('## ')}/>
                                    <Dropdown.Item text='Heading 3' onClick={(e) => this.wrapText('##### ')}/>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Button onClick={(e) => this.wrapText('**', '**')} icon size="small" aria-label="Make selected text bold"><Icon name="bold" /></Button>
                            <Button onClick={(e) => this.wrapText('*', '*')} icon size="small" aria-label="Make selected text italic"><Icon name="italic" /></Button>
                            <Button onClick={(e) => this.wrapText('__', '__')} icon size="small" aria-label="Make selected text underlined"><Icon name="underline" /></Button>
                        </Button.Group>
                        {' '}
                        <Button.Group>
                            <Button onClick={(e) => this.wrapText('* ')} icon size="small" aria-label="Make an unordered list"><Icon name="list" /></Button>
                            <Button onClick={(e) => this.wrapText('1. ')} icon size="small" aria-label="Make an ordered list"><Icon name="list ol" /></Button>
                        </Button.Group>
                        {' '}
                        <Button.Group>
                            <Button onClick={(e) => this.wrapText('[', '](url)')} icon size="small" aria-label="Insert a link"><Icon name="linkify" /></Button>
                            <Button onClick={(e) => this.wrapText('![', '](https://example.com/img.png)')} icon size="small" aria-label="Insert an image"><Icon name="file image" /></Button>
                            <Button onClick={(e) => this.wrapText('> ',)} icon size="small" aria-label="Insert a quote block"><Icon name="quote left" /></Button>
                            <Button onClick={(e) => this.wrapText('`', '`')} icon size="small" aria-label="Insert a code block"><Icon name="code" /></Button>
                        </Button.Group>
                    </div>
                </div>
                <div className="row" style={{marginTop:-25}}>
                    <div className="column form field ui">
                        <textarea 
                            style={{fontFamily: 'Courier New', fontWeight:'bold', height:'100%', maxHeight: 'initial'}}
                            ref="markdownTextarea" 
                            onChange={this.handleChange.bind(this)} 
                            value={this.props.title === this.state.title ? this.state.markdownContent: ((!this.props.markdown.trim() || this.props.markdown.trim() === '') && this.props.content ? t_converter.turndown(this.props.content) : this.props.markdown)}
                        />
                    </div>
                    <div className="column" style={{boxShadow: 'rgba(0, 0, 0, 0.25) 0px 0px 12px', padding:0, margin: '0 20px'}}>
                        <SlideContentView content={this.props.title === this.state.title ? this.state.htmlContent: this.props.content}
                        speakernotes='' hideSpeakerNotes={true} theme={deckTheme} hideBorder={true}/>
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
