import React from 'react';
import ReactDOM from 'react-dom'
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import Reveal from 'reveal';
import PresentationSlideList from './PresentationSlideList';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import loadPresentation from '../../../actions/loadPresentation';


var playerCss = {
    height: '1280px'
};


class Presentation extends React.Component{


  componentWillMount(){
    console.log("componentWillMount");

    // let element = document.createElement('link');
    // element.setAttribute('href', '/bower_components/reveal.js/css/themes/white.css');
    // element.setAttribute('rel', 'stylesheet');
    // element.setAttribute('type', 'text/css');


    this.context.executeAction(loadPresentation, {
		  deck: this.props.DeckTreeStore.flatTree
		});

  }

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
