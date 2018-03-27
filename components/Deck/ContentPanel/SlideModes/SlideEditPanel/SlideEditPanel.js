import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import SlideContentEditor from './SlideContentEditor';
import restoreDeckPageLayout from '../../../../../actions/deckpagelayout/restoreDeckPageLayout';
import {equals} from '../../../../../common.js';

class SlideEditPanel extends React.Component {
    constructor(props) {
        super(props);
        //this.currentID;
        this.currentContent;
        this.editorcontent = '';
        this.isLoading = true;
        this.destroy;
    }

    componentWillUnmount() {
        //show deckTree again
        //context.executeAction(restoreDeckPageLayout,{});
    }

    componentDidMount() {
        //this.currentID = this.props.selector.sid;
        this.currentContent = this.props.SlideEditStore.content;
    }

    componentDidUpdate() {
        //if (this.currentID !== this.props.selector.sid)
        //{
        //    console.log('slide id changed - destroy/unmount SlideContentEditor component');
        //    this.editorcontent = ''; //destroy/unmount SlideContentEditor component
        //    this.destroy = true;
        this.isLoading = this.isContentUndefined(this.props);

        if(this.currentContent !== this.props.SlideEditStore.content)
        {
            //console.log('content changed');
            this.editorcontent = ''; //destroy/unmount SlideContentEditor component
            this.destroy = true;
            //this.currentID = this.props.selector.sid;
            this.currentContent = this.props.SlideEditStore.content;
        }
        //}
        else {
            this.destroy = false;
        }
    }

    componentWillReceiveProps(nextProps) {
        this.isLoading = this.isContentUndefined(nextProps);
    }

    componentWillUnmount() {
        this.props.SlideViewStore.content = '';
        this.isLoading = true;
    }

    isContentUndefined(props) {
        return props.SlideEditStore.content === undefined || props.SlideEditStore.content === '';
    }

    shouldComponentUpdate(nextProps, nextState) {
        let samePropsState = equals(this.props, nextProps);
        return !samePropsState;
    }

    render() {
        //handle the notifications --> in process.env.BROWSER
        let self = this;
        //-------------------------------------------------------
        // Only load WYSIWYG-Editor when the content has been loaded via loadSlideEdit.js
//        if (this.props.SlideEditStore.content !== '' && !this.destroy){
        if (!this.isLoading && !this.destroy) {
            this.editorcontent = <SlideContentEditor title={this.props.SlideEditStore.title}
                                content={this.props.SlideEditStore.content}
                                id={this.props.SlideEditStore.id}
                                speakernotes={this.props.SlideEditStore.speakernotes}
                                selector={this.props.selector} />;
        } else {
            const compStyle = {
                minHeight: 600,
                overflowY: 'auto',
                overflowX: 'auto',
                position: 'relative'
            };
            this.editorcontent = <div className="ui bottom attached segment">
                        <div className="ui active dimmer"><div className="ui text loader">Loading...</div></div>
                        <div className="ui" style={compStyle}/>
                    </div>;
        }

        return (
            <div ref="slideEditPanel" className="ui bottom attached segment">
                {this.editorcontent}
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
