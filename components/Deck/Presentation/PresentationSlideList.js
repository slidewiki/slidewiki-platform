import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import PresentationStore from '../../../stores/PresentationStore';
import PresentationSlide from './PresentationSlide';
import Reveal from 'reveal';

class PresentationSlideList extends React.Component {
	getSlides(){

	    console.log('[SWIK-134] flatTree', this.props.flatTree[0]);

	    var slides = this.props.PresentationStore.content;

	    var returnList = [];
	    if(slides !== undefined){
				for (var i = 0; i < slides.length; i++) {
					let content = slides[i]['content'];
					returnList.push(<PresentationSlide content={content}  key={i} />);
				}

	      return returnList;

    	}
	}

	componentDidMount(){
		console.log('PresentationStore.content', this.props.PresentationStore.content)
	    // if(this.props.PresentationStore.content !== ''){
			Reveal.initialize();
		// }

  }


	render(){
		return(
			<div className="slides">
				<section></section>
				{this.getSlides()}
			</div>
		)
	}

}

PresentationSlideList = connectToStores(PresentationSlideList, [PresentationStore], (context, props) => {
    return {
        PresentationStore: context.getStore(PresentationStore).getState()
    };
});


export default PresentationSlideList;
