import React from 'react';
import ReactDOM from 'react-dom'
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import Reveal from 'reveal';
import PresentationStore from '../../../stores/PresentationStore';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import PresentationSlide from './PresentationSlide';
import loadPresentation from '../../../actions/loadPresentation';

var playerCss = {
    height: '700px'
};
var slides = <slide />;

class Presentation extends React.Component{

  getSlides(){

    console.log('[SWIK-134] flatTree', this.props.DeckTreeStore.flatTree);

    var slides = this.props.PresentationStore.content;//"<section><h1>Stay classy, San Diego!</h1></section>";

    var returnList = [];
    if(slides){

      for(var s in slides){
        console.log("s:", s);
        returnList.push(<Presentation content={s} />);
      }
      return <PresentationSlide content={content} />

    }


  }

  componentWillMount(){
    console.log("componentWillMount");
    this.context.executeAction(loadPresentation, {
		  deck: this.props.DeckTreeStore.flatTree
		});

  }

  //See https://github.com/ryanflorence/react-training/blob/gh-pages/lessons/05-wrapping-dom-libs.md for info about integrating a separate library
	componentDidMount(){
    console.log('[SWIK] Calling componentDidMount()');

    Reveal.initialize();
  }

	render(){
    console.log("render");
		return (
            <div className="reveal" style={playerCss}>
                <div className="slides">
                    {slides}
                </div>
            </div>
        )
	}

}

Presentation.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

Presentation = connectToStores(Presentation, [DeckTreeStore, PresentationStore], (context, props) => {
    console.log("[SWIK-134] Presentation connectToStores. context: ", context);
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
  			PresentationStore: context.getStore(PresentationStore).getState()
    };
});


export default Presentation;
