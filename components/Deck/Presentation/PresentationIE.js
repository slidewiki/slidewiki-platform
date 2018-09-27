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
        if(process.env.BROWSER){
            let all = document.getElementsByTagName('div');
            for (let i = 0; i < all.length; i++) {
                if ($(all[i]).html().trim().length < 1) {
                    all[i].innerHTML = '';
                }
            };
        }
        let pptxwidth = 0;
        let pptxheight = 0;
        let elements = document.getElementsByClassName('pptx2html');
        for (let i = 0; i < elements.length; i++) {
            let eltWidth = parseInt(elements[i].style.width.replace('px', ''));
            let eltHeight = parseInt(elements[i].style.height.replace('px', ''));
            if (eltWidth > pptxwidth) {
                pptxwidth = eltWidth;
            }
            if (eltHeight > pptxheight) {
                pptxheight = eltHeight;
            }
        }
        if (pptxwidth !== 0 && pptxheight !== 0) {
            Reveal.initialize({
                width: pptxwidth,
                height: pptxheight,
            });
        } else {
            Reveal.initialize({
                width: '100%',
                height: '100%',
            });
        }
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,'slides']);
    }


    render(){
        let slides = this.getSlides();
        return(
          <div className={'reveal'} style={{position: 'absolute', top: 0}}>
              <div className={'slides'}>
                 {slides}
              </div>
          </div>
        );
    }

    getSlides(){
        let slides = this.props.PresentationStore.content;
        let html = <section />;
        if(slides){
            html = slides.map((slide) => {
                let content = slide.content.replace(' src=', ' data-src=') + ((slide.speakernotes) ? '<aside class="notes">' + slide.speakernotes + '</aside>' : '');
                return <section id={'slide-' + slide.id} key={slide.id}><div dangerouslySetInnerHTML={{__html:content}}></div></section>;
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
