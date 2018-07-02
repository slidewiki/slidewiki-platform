import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import SlideContentEditor from './SlideContentEditor';
import MarkdownEditor from './MarkdownEditor';
import restoreDeckPageLayout from '../../../../../actions/deckpagelayout/restoreDeckPageLayout';



class SlideEditPanel extends React.Component {
    constructor(props) {
        super(props);
        this.currentID;
        this.editorcontent = '';
    }
    componentWillMount(){
      /* TODO: allow server-side rendering
        if (this.props.useMarkdown && (this.currentID !== this.props.selector.sid))
        {
            //console.log('slide id changed - destroy/unmount SlideContentEditor component');
            this.editorcontent = ''; //destroy/unmount SlideContentEditor component
            this.currentID = this.props.selector.sid;
        }
        */
    }
    componentDidMount(){

    }
    componentDidUpdate(){
        if (this.currentID !== this.props.selector.sid)
        {
            //console.log('slide id changed - destroy/unmount SlideContentEditor component');
            this.editorcontent = ''; //destroy/unmount SlideContentEditor component
            this.currentID = this.props.selector.sid;
        }
    }
    render() {
        if(this.props.useMarkdown){
            if (this.currentID === this.props.selector.sid){
                this.editorcontent = <MarkdownEditor title={this.props.SlideEditStore.title}
                                content={this.props.SlideEditStore.content} markdown={this.props.SlideEditStore.markdown}
                                id={this.props.SlideEditStore.id}
                                speakernotes={this.props.SlideEditStore.speakernotes}
                                selector={this.props.selector} />;
            }else {
                this.editorcontent = null;
            }
        }else{
            if (this.currentID === this.props.selector.sid){
                this.editorcontent = <SlideContentEditor title={this.props.SlideEditStore.title}
                                    content={this.props.SlideEditStore.content}
                                    id={this.props.SlideEditStore.id}
                                    speakernotes={this.props.SlideEditStore.speakernotes}
                                    selector={this.props.selector} />;
            }else {
                this.editorcontent = null;
            }
        }
        const loadStyle = {
            minWidth: '100%',
            minHeight: 610,
            overflowY: 'auto',
            overflowX: 'auto',
        };
        //{(this.props.SlideEditStore.content === undefined) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
        return (
            <div ref="slideEditPanel" className="ui bottom attached segment">
            {(this.currentID && this.currentID !== this.props.selector.sid) ? <div style={loadStyle} className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
            {this.editorcontent}
            </div>
        );
    }
}

SlideEditPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

SlideEditPanel = connectToStores(SlideEditPanel, [SlideEditStore, UserProfileStore], (context, props) => {
    return {
        SlideEditStore: context.getStore(SlideEditStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default SlideEditPanel;
