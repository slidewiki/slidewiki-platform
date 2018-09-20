import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import PresentationStore from '../../../stores/PresentationStore';

class PresentationNeo4J extends React.Component{
    constructor(props){
        super(props);
        this.slides = [];
        this.deck = this.props.PresentationStore.selector.id;

    }

    componentDidMount(){
        // add to the mathjax rendering queue the command to type-set the slide content
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,'slides']);

    }

    componentDidUpdate(){

    }
    render(){
        this.slides = this.getSlides();
        return(
            <article ref='container' id='container' className="slides">
                <carousel>
                    {this.slides}
                </carousel>
            </article>
        );
    }

    getSlides(){
        let slides = this.props.PresentationStore.content;

        let returnList = [];
        if(slides){
            for (let i = 0; i < slides.length; i++) {
                let slide = slides[i];
                returnList.push(<slide key={slide.id} id={'slide-' + slide.id} dangerouslySetInnerHTML={{__html:slide.content}}>{}</slide>);
            }
            return returnList;

        }
        else{
            return (<section />);
        }
    }

}

PresentationNeo4J.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

PresentationNeo4J = connectToStores(PresentationNeo4J, [PresentationStore], (context, props) => {
    return {
        PresentationStore: context.getStore(PresentationStore).getState()
    };
});


export default PresentationNeo4J;
