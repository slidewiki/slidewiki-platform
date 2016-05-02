import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import Reveal from 'reveal';
import PresentationStore from '../../../stores/PresentationStore';

class Presentation extends React.Component {

	render(){
		return (
			<h1>Stay classy, San Diego</h1>
		);
	}

}

Presentation = connectToStores(Presentation, [PresentationStore], (context, props) => {
    return {
    };
});


export default Presentation;
