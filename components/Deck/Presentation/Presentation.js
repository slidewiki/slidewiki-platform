import React from 'react';
import ReactDOM from 'react-dom'
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import Reveal from 'reveal';
import PresentationSlideList from './PresentationSlideList';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import loadPresentation from '../../../actions/loadPresentation';

var playerCss = {
    height: '700px'
};
var slides = <slide />;

class Presentation extends React.Component{


  componentWillMount(){
    console.log("componentWillMount");
    this.context.executeAction(loadPresentation, {
		  deck: this.props.DeckTreeStore.flatTree
		});

  }

  //See https://github.com/ryanflorence/react-training/blob/gh-pages/lessons/05-wrapping-dom-libs.md for info about integrating a separate library

	render(){
    console.log("render");
		return (
            <div className="reveal" style={playerCss}>
            <PresentationSlideList flatTree={this.props.DeckTreeStore.flatTree} />
            </div>
        )
	}

}

Presentation.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

Presentation = connectToStores(Presentation, [DeckTreeStore], (context, props) => {
    console.log("[SWIK-134] Presentation connectToStores. context: ", context);
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});


export default Presentation;
