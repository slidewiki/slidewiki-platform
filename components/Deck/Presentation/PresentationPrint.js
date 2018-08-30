import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import PresentationStore from '../../../stores/PresentationStore';

let playerCss = {
    height: '100%',
    // position: 'absolute',
    top: '0',
    fontSize: '100%'
};

let clearStyle = {
    clear: 'both'
};

let pdf;
if(process.env.BROWSER){
    pdf = require('../../../custom_modules/reveal.js/css/print/pdf.css');
}


class PresentationPrint extends React.Component{
    constructor(props){
        super(props);
        this.playerCss = playerCss;
        this.slides = [];
        this.startingSlide = this.props.PresentationStore.selector.sid;
        this.deck = this.props.PresentationStore.selector.id;
        this.revealDiv = null;
    }

    componentDidMount(){
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,'slides']);
        setTimeout(() => { window.print(); }, 2000);

    }

    componentDidUpdate(){

    }
    render(){
        this.slides = this.getSlides();
        return(
            <div id="presentationPrint">
                <div className="reveal-old" style={this.playerCss}  ref={(refToDiv) => this.revealDiv = refToDiv} data-transition="none" data-background-transition="none">
                    <div className="slides">
        			     	{this.slides}
        			      </div>
                </div>
                <br style={clearStyle} />
            </div>
        );
    }

    getSlides(){
        let slides = this.props.PresentationStore.content;

        let returnList = [];
        if(slides){
            for (let i = 0; i < slides.length; i++) {
                let slide = slides[i];
                let notes = '';
                if(slide.speakernotes){
                    notes =  '<aside class="notes">' + slide.speakernotes + '</aside>';
                }
                let content = slide.content + notes;
                returnList.push(<section key={slide.id + '-' + i} style={{'page-break-after' : 'always'}} dangerouslySetInnerHTML={{__html:content}} id={'slide-' + slide.id} />);
            }
            return returnList;

        }
        else{
            return (<section />);
        }
    }

}

PresentationPrint.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

PresentationPrint = connectToStores(PresentationPrint, [PresentationStore], (context, props) => {
    return {
        PresentationStore: context.getStore(PresentationStore).getState()
    };
});


export default PresentationPrint;
