import React from 'react';
import ReactDOM from 'react-dom'
import {NavLink} from 'fluxible-router';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import SlideViewStore from '../../../stores/SlideViewStore';

class PresentationSlide extends React.Component {
	render(){
		console.log("PresentationSlide");
		
		return (
			<section dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.content}} />
		);
	}

}

PresentationSlide = connectToStores(PresentationSlide, [SlideViewStore], (context, props) => {
	console.log("[SWIK-134] In PresentationSlide connectToStores function");
	console.log("[SWIK-134] context: ", context);
    return {
    	SlideViewStore: context.getStore(SlideViewStore).getState()
    };
});

export default PresentationSlide;
