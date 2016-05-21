import React from 'react';
import ReactDOM from 'react-dom'
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import Reveal from 'reveal';
import PresentationStore from '../../../stores/PresentationStore';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import PresentationSlide from './PresentationSlide';
//import PresentationSlideList from './PresentationSlideList';

var playerCss = {
    height: '700px'
};

class Presentation extends React.Component{

	//See https://github.com/ryanflorence/react-training/blob/gh-pages/lessons/05-wrapping-dom-libs.md for info about integrating a separate library
	componentDidMount(){
    console.log('[SWIK] Calling componentDidMount()');    

    Reveal.initialize();

	render(){
		return (
            <div className="reveal" style={playerCss}>
                <div className="slides">                    
                    <PresentationSlide />
                </div>
            </div>
        )
	}

}
//TODO: Will need to remove the PresentationStore, I suspect we won't need it.
Presentation = connectToStores(Presentation, [DeckTreeStore], (context, props) => {
    console.log("[SWIK-134] Presentation connectToStores. context: ", context);
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});


export default Presentation;
