import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores, provideContext } from 'fluxible-addons-react';
import PresentationStore from '../../../stores/PresentationStore';
import SlideViewStore from '../../../stores/SlideViewStore';

let sectionStyle = { 'top': 'unset !important'};

class PresentationSlide extends React.Component {
    render(){
        return (
            <section dangerouslySetInnerHTML={{__html:this.props.content}} id={this.props.id} />
        );
    }

}

export default PresentationSlide;
