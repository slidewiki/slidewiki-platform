import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
class PresentationSlideList extends React.Component {
	constructor(props){
		
	}
	render(){
		return(
			<div className="slides">
			this.forEach(<Slide />)
			</div>	
		)
	}

}

PresentationSlideList = connectToStores(PresentationSlideList, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});


export default PresentationSlideList;
