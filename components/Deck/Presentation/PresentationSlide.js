import React from 'react';
import ReactDOM from 'react-dom'
import {NavLink} from 'fluxible-router';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import PresentationStore from '../../../stores/PresentationStore';
import SlideViewStore from '../../../stores/SlideViewStore';

class PresentationSlide extends React.Component {
	render(){

		return (
			<section dangerouslySetInnerHTML={{__html:this.props.content}} />
		);
	}

}

// PresentationSlide = connectToStores(PresentationSlide, [SlideViewStore, PresentationStore], (context, props) => {
//
//     return {
//     	SlideViewStore: context.getStore(SlideViewStore).getState()
//
//     };
// });

export default PresentationSlide;
