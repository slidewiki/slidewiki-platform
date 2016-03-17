import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import SlideControlUtil from './util/SlideControlUtil';

import DeckTreeStore from '../../../../stores/DeckTreeStore';

class SlideControl extends React.Component {
    componentDidMount() {
        // key('right', 'slideControl', this.handleNextClick.bind(this));
        // key('shift+right', 'slideControl', this.handleForwardClick.bind(this));
        // key('left', 'slideControl', this.handlePreviousClick.bind(this));
        // key('shift+left', 'slideControl', this.handleBackwardClick.bind(this));
    }
    componentWillUnmount() {

    }
    handleNextClick(){
        let nextPath = SlideControlUtil.nextSlidePath(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode);
        if(nextPath){
            this.context.executeAction(navigateAction, {
                url: nextPath
            });
        }
        //returning false stops the event and prevents default browser events
        return false;
    }
    handlePreviousClick(){
        let prevPath = SlideControlUtil.prevSlidePath(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode);
        if(prevPath){
            this.context.executeAction(navigateAction, {
                url: prevPath
            });
        }
        return false;
    }
    handleForwardClick(){
        let lastPath = SlideControlUtil.lastSlidePath(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode);
        if(lastPath){
            this.context.executeAction(navigateAction, {
                url: lastPath
            });
        }
        return false;
    }
    handleBackwardClick(){
        let firstPath = SlideControlUtil.firstSlidePath(this.props.DeckTreeStore.selector, this.props.DeckTreeStore.flatTree, this.props.mode);
        if(firstPath){
            this.context.executeAction(navigateAction, {
                url: firstPath
            });
        }
        return false;
    }
    render() {
        return (
            <div className="sw-slidercontrol" ref="slideControl">
                <div className="panel">
                    <div className="ui top blue small attached progress">
                      <div className="bar"></div>
                    </div>
                    <div className="ui bottom attached segment center aligned">
                        <div className="compact ui icon buttons">
                            <div className="ui button" onClick={this.handleBackwardClick.bind(this)}><i className="icon step backward"></i></div>
                            <div className="ui button" onClick={this.handlePreviousClick.bind(this)}><i className="caret left icon disabled"></i></div>
                            <div className="ui blue button">2/12</div>
                            <div className="ui button" onClick={this.handleNextClick.bind(this)}><i className="icon caret right disabled"></i></div>
                            <div className="ui button" onClick={this.handleForwardClick.bind(this)}><i className="icon step forward"></i></div>
                            <div className="ui teal button"><i className="icon expand"></i></div>
                        </div>
                    </div>

                </div>
            </div>
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
