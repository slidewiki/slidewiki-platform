import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import PresentationStore from '../../../stores/PresentationStore';
import PresentationSlide from './PresentationSlide';
import Reveal from 'reveal';

class PresentationSlideList extends React.Component {
	getSlides(){

    console.log('[SWIK-134] flatTree', this.props.flatTree[0]);

    var slides = this.props.PresentationStore.content;//"<section><h1>Stay classy, San Diego!</h1></section>";

    var returnList = [];
    if(slides !== undefined){
			//console.log("slides:", slides[0]['content']);

			for (var i = 0; i < slides.length; i++) {
				let content = slides[i]['content'];
				//console.log('slides[i]', slides[i]['content']);
				returnList.push(<PresentationSlide content={content} />);
			}

      // for(var s in slides){
      //   console.log("s:", s['content']);
      //
      // }
      return returnList;//<PresentationSlide content={content} />

    }


  }

	componentDidMount(){
    console.log('[SWIK] Calling componentDidMount()');

    Reveal.initialize();
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
