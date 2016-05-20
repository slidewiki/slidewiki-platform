import React from 'react';
import ReactDOM from 'react-dom'
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import Reveal from 'reveal';
import PresentationStore from '../../../stores/PresentationStore';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import PesentationSlide from './PresentationSlide';
import PresentationSlideList from './PresentationSlideList';

class Presentation extends React.Component{
	//See https://github.com/ryanflorence/react-training/blob/gh-pages/lessons/05-wrapping-dom-libs.md for info about integrating a separate library
	componentDidMount(){
    console.log('[SWIK] Calling componentDidMount()');
		var playerCss = {
			height: '700px'
		};
    this.pres = (
			<div className="reveal" style={playerCss}>
				<div className="slides">

				</div>
			</div>
		);



    //document.body.appendChild(this.pres);

    console.log("this.props:", this.props);
    this.renderSlides(this.props);


	}

  renderSlides(props){
    console.log('[SWIK] Calling renderSlides()');
    console.log(this.pres);
    ReactDOM.render(this.pres, ReactDOM.findDOMNode(this));
    console.log('[SWIK] Calling Reveal.initialize()');
    Reveal.initialize();
    console.log('[SWIK] Called Reveal.initialize()');

  }

	render(){

		return <div />;
	}

}
//TODO: Will need to remove the PresentationStore, I suspect we won't need it.
Presentation = connectToStores(Presentation, [DeckTreeStore], (context, props) => {
    return {
    };
});


export default Presentation;
