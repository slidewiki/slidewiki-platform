import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores, provideContext } from 'fluxible-addons-react';
import PresentationStore from '../../../stores/PresentationStore';
import SlideViewStore from '../../../stores/SlideViewStore';

var sectionStyle = {
	'top': 'unset !important'
}

class PresentationSlide extends React.Component {
	componentDidMount(){
		this.props.style = sectionStyle;
	}
	render(){

		return (
			<section dangerouslySetInnerHTML={{__html:this.props.content}} style={sectionStyle} />
		);
	}

}

export default PresentationSlide;
