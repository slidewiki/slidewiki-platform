import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores, provideContext } from 'fluxible-addons-react';
import PresentationStore from '../../../stores/PresentationStore';
import SlideViewStore from '../../../stores/SlideViewStore';
// import ChartRender from '../util/ChartRender';

let sectionStyle = { 'top': 'unset !important'};

class PresentationSlide extends React.Component {
		componentDidMount(){
		//this.props.style = sectionStyle;
            // If there are some charts in the slide, render them.
            if ($("div[id^=chart]").length) this.forceUpdate();
		}

		componentDidUpdate(){
		//	ChartRender.createCharts();
		}

		render(){

				return (
					<section dangerouslySetInnerHTML={{__html:this.props.content}} id={this.props.id} />
				);
		}

}

export default PresentationSlide;
