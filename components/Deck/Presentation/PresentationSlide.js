import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores, provideContext } from 'fluxible-addons-react';
import PresentationStore from '../../../stores/PresentationStore';
import SlideViewStore from '../../../stores/SlideViewStore';
import LinkToDeck from './LinkToDeck';

let sectionStyle = { 'top': 'unset !important'};

class PresentationSlide extends React.Component {
    render(){
        return (
            <section  id={this.props.id}>
                <div dangerouslySetInnerHTML={{__html:this.props.content}} />
                <LinkToDeck deck={this.props.deck} subdeck={this.props.subdeck} slide={this.props.id} />
            </section>
        );
    }

}

export default PresentationSlide;
