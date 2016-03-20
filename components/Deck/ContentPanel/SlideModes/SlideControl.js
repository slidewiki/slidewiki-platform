import React from 'react';
import {HotKeys} from 'react-hotkeys';
//import ReactDOM from 'react-dom';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import SlideControlUtil from './util/SlideControlUtil';
import DeckTreeStore from '../../../../stores/DeckTreeStore';
import expandContentPanel from '../../../../actions/deckpagelayout/expandContentPanel';
import restoreDeckPageLayout from '../../../../actions/deckpagelayout/restoreDeckPageLayout';

class SlideControl extends React.Component {
    constructor(props) {
        super(props);
        this.state={expanded: 0};
    }
    componentDidMount() {
        this.updateProgressbar();
    }
    componentDidUpdate(){
        this.updateProgressbar();
        //ReactDOM.findDOMNode(this.refs.slideControl).focus();
    }
    getKeyMap() {
        const keyMap = {
            'moveForward': 'right',
            'moveBackward': 'left',
            'fastForward': 'shift+right',
            'fastBackward': 'shift+left'
        };
        return keyMap;
    }
    getKeyMapHandlers() {
        const handlers = {
            'moveForward': (event) => this.handleNextClick(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode),
            'moveBackward': (event) => this.handlePreviousClick(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode),
            'fastForward': (event) => this.handleForwardClick(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode),
            'fastBackward': (event) => this.handleBackwardClick(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode)
        };
        return handlers;
    }
    handleExpandClick(){
        this.context.executeAction(expandContentPanel, {});
        this.state.expanded = 1;
        return false;
    }
    handleCollapseClick(){
        this.context.executeAction(restoreDeckPageLayout, {});
        this.state.expanded = 0;
        return false;
    }
    handleNextClick(selector, flatTree, mode){
        let nextPath = SlideControlUtil.nextSlidePath(selector, flatTree, mode);
        if(nextPath){
            this.context.executeAction(navigateAction, {
                url: nextPath
            });
        }
        //returning false stops the event and prevents default browser events
        return false;
    }
    handlePreviousClick(selector, flatTree, mode){
        let prevPath = SlideControlUtil.prevSlidePath(selector, flatTree, mode);
        if(prevPath){
            this.context.executeAction(navigateAction, {
                url: prevPath
            });
        }
        return false;
    }
    handleForwardClick(selector, flatTree, mode){
        let lastPath = SlideControlUtil.lastSlidePath(selector, flatTree, mode);
        if(lastPath){
            this.context.executeAction(navigateAction, {
                url: lastPath
            });
        }
        return false;
    }
    handleBackwardClick(selector, flatTree, mode){
        let firstPath = SlideControlUtil.firstSlidePath(selector, flatTree, mode);
        if(firstPath){
            this.context.executeAction(navigateAction, {
                url: firstPath
            });
        }
        return false;
    }
    updateProgressbar() {
        let percentage=(SlideControlUtil.getSlidePosition(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree)/SlideControlUtil.getSlidesNumber(this.props.DeckTreeStore.flatTree))*100;
        let progressbar = this.refs.progressbar;
        //the following part only executes when javascript is enabled!
        $(progressbar).progress({percent: percentage});
        //$(progressbar).show();
    }
    render() {
        //hide focused outline
        let compStyle = {
            outline: 'none'
        };
        return (
            <HotKeys keyMap={this.getKeyMap()} handlers={this.getKeyMapHandlers()} ref="slideControl" style={compStyle}>
                <div className="ui panel bottom attached">
                    <div className="ui olive bottom attached progress" ref="progressbar">
                      <div className="bar"></div>
                    </div>
                    <div className="ui bottom attached segment center aligned">
                        <div className="compact ui icon buttons">
                            <div className="ui button" onClick={this.handleBackwardClick.bind(this, this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode)}><i className="icon step backward"></i></div>
                            <div className="ui button" onClick={this.handlePreviousClick.bind(this, this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode)}><i className="caret left blue icon"></i></div>
                            <div className="ui blue button">{SlideControlUtil.getSlidePosition(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree)}/{SlideControlUtil.getSlidesNumber(this.props.DeckTreeStore.flatTree)}</div>
                            <div className="ui button" onClick={this.handleNextClick.bind(this, this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode)}><i className="icon caret blue right"></i></div>
                            <div className="ui button" onClick={this.handleForwardClick.bind(this, this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode)}><i className="icon step forward"></i></div>
                            {this.state.expanded ? <div className="ui yellow button" onClick={this.handleCollapseClick.bind(this)}><i className="icon compress"></i></div> : <div className="ui teal button" onClick={this.handleExpandClick.bind(this)}><i className="icon expand"></i></div>}

                        </div>
                    </div>

                </div>
            </HotKeys>
        );
    }
}

SlideControl.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
SlideControl = connectToStores(SlideControl, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});

export default SlideControl;
