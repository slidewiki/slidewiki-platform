import React from 'react';
import PropTypes from 'prop-types';
import { handleRoute } from 'fluxible-router';
import PresentationSlide from './PresentationSlide';
import { connectToStores } from 'fluxible-addons-react';
import { Microservices } from '../../../configs/microservices';
import PresentationStore from '../../../stores/PresentationStore';


class PresentationIE extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
    }


    render(){
        let slides = this.getSlides();
        // Load the theme stylesheet
        let styleName = 'default';
        if(this.props.PresentationStore.theme && typeof this.props.PresentationStore.theme !== 'undefined')
            styleName = this.props.PresentationStore.theme;
        if (styleName === '' || typeof styleName === 'undefined' || styleName === 'undefined')//if none of above yield a theme they will be legacy decks:
            styleName = 'white';

        return(
          <div className={'reveal'} style={{position: 'absolute', top: 0}}>
              <div className={'slides'}>
                 {slides}
              </div>
              <span className="revealTheme" style={{display: 'none'}}>{styleName}</span>
          </div>
        );
    }

    getSlides(){
        let slides = this.props.PresentationStore.content;
        let html = <section />;
        if(slides){
            html = slides.map((slide) => {
                let content = slide.content.replace(' src=', ' data-src=') + ((slide.speakernotes) ? '<aside class="notes">' + slide.speakernotes + '</aside>' : '');
                return <section id={'slide-' + slide.id} key={slide.id} dangerouslySetInnerHTML={{__html:content}}></section>;
            });
        }
        return html;
    }

}

PresentationIE = connectToStores(PresentationIE, [PresentationStore], (context, props) => {
    return {
        PresentationStore: context.getStore(PresentationStore).getState()
    };
});
//PresentationIE = handleRoute(PresentationIE);//NOTE add currentRoute attribute to constructor props

export default PresentationIE;
