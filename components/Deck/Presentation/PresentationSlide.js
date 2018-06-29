import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores, provideContext } from 'fluxible-addons-react';
import PresentationStore from '../../../stores/PresentationStore';
import SlideViewStore from '../../../stores/SlideViewStore';

let sectionStyle = { 'top': 'unset !important'};

class PresentationSlide extends React.Component {
    constructor(props) {
        super(props);
        this.replaced = false;
        this.i = 0;
    }
    render(){
        let slideContent = '';
        if (this.replaced === false && this.props.content !== ''){
            slideContent = this.props.content.replace(/ src/g, ' data-src');
            this.replaced = true;
        }
        return (
            <section dangerouslySetInnerHTML={{__html:slideContent}} id={this.props.id} />
        );
    }

}

export default PresentationSlide;
