import PropTypes from 'prop-types';
import React from 'react';
import {HotKeys} from 'react-hotkeys';
//import ReactDOM from 'react-dom';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import SlideControlUtil from './util/SlideControlUtil';
import DeckTreeStore from '../../../../stores/DeckTreeStore';
import updateMode from '../../../../actions/decktree/updateMode';

class SlideControl extends React.Component {
    constructor(props) {
        super(props);
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
    handleNextClick(selector, flatTree, mode){
        let nextPath = SlideControlUtil.nextSlidePath(selector, flatTree, mode);
        if(nextPath){
            this.context.executeAction(updateMode, {mode: 'loading'});
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
            this.context.executeAction(updateMode, {mode: 'loading'});
            this.context.executeAction(navigateAction, {
                url: prevPath
            });
        }
        return false;
    }
    handleForwardClick(selector, flatTree, mode){
        let lastPath = SlideControlUtil.lastSlidePath(selector, flatTree, mode);
        if(lastPath){
            this.context.executeAction(updateMode, {mode: 'loading'});
            this.context.executeAction(navigateAction, {
                url: lastPath
            });
        }
        return false;
    }
    handleBackwardClick(selector, flatTree, mode){
        let firstPath = SlideControlUtil.firstSlidePath(selector, flatTree, mode);
        if(firstPath){
            this.context.executeAction(updateMode, {mode: 'loading'});
            this.context.executeAction(navigateAction, {
                url: firstPath
            });
        }
        return false;
    }
    updateProgressbar() {
        let percentage=(SlideControlUtil.getSlidePosition(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree)/SlideControlUtil.getSlidesNumber(this.props.DeckTreeStore.flatTree))*100;
        //let progressbar = this.refs.progressbar;
        let progressbar = '.slide-progress-bar';
        //the following part only executes when javascript is enabled!
        $(progressbar).progress({percent: percentage});
        //$(progressbar).show();
    }
    render() {
        //hide focused outline
        let compStyle = {
            outline: 'none'
        };
        let slideProgressNumbers = SlideControlUtil.getSlidePosition(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree) + '/' + SlideControlUtil.getSlidesNumber(this.props.DeckTreeStore.flatTree);
        return (
            <HotKeys keyMap={this.getKeyMap()} handlers={this.getKeyMapHandlers()} ref="slideControl" style={compStyle}>
                <div className="ui icon buttons large">
                    <button className="ui button" onClick={this.handleBackwardClick.bind(this, this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode)} type="button" aria-label="First slide" data-tooltip="First slide"><i className="large icon fast backward"></i></button>
                    <button className="ui button" onClick={this.handlePreviousClick.bind(this, this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode)} type="button" aria-label="Previous slide" data-tooltip="Previous slide "><i className="large step backward icon"></i></button>
                    {!this.props.isMobile ? <button className="ui grey large button" type="button" aria-label="Slide number" data-tooltip="Slide number">{slideProgressNumbers}</button>: ''}
                    <button className="ui button" onClick={this.handleNextClick.bind(this, this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode)} aria-label="Next slide" data-tooltip="Next slide"><i className="large icon step forward"></i></button>
                    <button className="ui button" onClick={this.handleForwardClick.bind(this, this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode)} aria-label="Last slide" data-tooltip="Last slide"><i className="large icon fast forward"></i></button>
                </div>
            </HotKeys>
        );
    }
}

SlideControl.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
SlideControl = connectToStores(SlideControl, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});

export default SlideControl;
