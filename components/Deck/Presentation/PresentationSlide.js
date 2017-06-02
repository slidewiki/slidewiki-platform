import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores, provideContext } from 'fluxible-addons-react';
import PresentationStore from '../../../stores/PresentationStore';
import SlideViewStore from '../../../stores/SlideViewStore';

let sectionStyle = { 'top': 'unset !important'};

class PresentationSlide extends React.Component {
    componentDidMount(){

		//this.props.style = sectionStyle;



        let pptxwidth = '900';
        let pptxheight = '700';
        if(this.props.content.search('pptx2html') !== -1){
            let pptxwidth = $('.pptx2html').width();
            let pptxheight = $('.pptx2html').height();
        } else {
            let pptxwidth = '100%';
            let pptxheight = '100%';
        }
        //update reveal configuration based on slide dimension
        console.log(pptxwidth + pptxwidth);
/*
        Reveal.configure({
            width: pptxwidth,
            height: pptxheight,
            transition: 'none',
            backgroundTransition: 'none',
            history: true,
            dependencies: [
                { src: '/custom_modules/reveal.js/plugin/notes/notes.js', async: true },
                { src: '/custom_modules/reveal.js/plugin/zoom-js/zoom.js', async: true },
            ]
        });

        Reveal.configure({ width: pptxwidth, height: pptxheight });*/
    }
    render(){
        return (
            <section dangerouslySetInnerHTML={{__html:this.props.content}} id={this.props.id} />
        );
    }

}

export default PresentationSlide;
