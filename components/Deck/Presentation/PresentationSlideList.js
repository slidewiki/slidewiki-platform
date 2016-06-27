import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import PresentationStore from '../../../stores/PresentationStore';
import PresentationSlide from './PresentationSlide';


class PresentationSlideList extends React.Component {
	getSlides(){
	    var slides = this.props.PresentationStore.content;

	    var returnList = [];
	    if(slides !== undefined){
				for (var i = 0; i < slides.length; i++) {
					let speakerNotes = slides[i]['speakerNotes'];
					let content = slides[i]['content'] + '<aside class="notes">' + speakerNotes + '</aside>';

					returnList.push(<PresentationSlide content={content} speakerNotes={speakerNotes}  key={i} />);
				}

	      return returnList;

    	}
	}

	componentDidMount(){

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
