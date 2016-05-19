import React from 'react';
import ReactDOM from 'react-dom'
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import Reveal from 'reveal';
import PresentationStore from '../../../stores/PresentationStore';



class Presentation extends React.Component{
	//See https://github.com/ryanflorence/react-training/blob/gh-pages/lessons/05-wrapping-dom-libs.md for info about integrating a separate library
	componentDidMount(){
    console.log('[SWIK] Calling componentDidMount()');
		var playerCss = {
			height: '700px'
		};
    this.pres = (
			<div className="reveal" style={playerCss}>
				<div className="slides">
					<section>
						<p>
							Karma police, arrest this man<br />
							He talks in maths<br />
							He buzzes like a fridge he''s like a detuned radio
						</p>
					</section>
					<section>
						<p>
							Karma police, arrest this girl<br />
							Her Hitler hairdo is<br />
							Making me feel ill<br />
							And we have crashed her party
						</p>
					</section>
					<section>
						<p>
								This is what you get<br />
							 	This is what you get<br />
							 	This is what you get when you mess with us
						</p>
					</section>
					<section>
					<p>
						Karma police<br />
						I''ve given all I can<br />
						It''s not enough<br />
						I''ve given all I can<br />
						But we''re still on the payroll
					</p>
					</section>
					<section>
						<p>
								This is what you get<br />
							 	This is what you get<br />
							 	This is what you get when you mess with us
						</p>
					</section>
					<section>
						<p>
							For a minute there, I lost myself, I lost myself<br />
							Phew, for a minute there, I lost myself, I lost myself<br />
						</p>
					</section>
					<section>
						<p>
							For a minute there, I lost myself, I lost myself<br />
							Phew, for a minute there, I lost myself, I lost myself<br />
						</p>
					</section>
				</div>
			</div>
		);



    //document.body.appendChild(this.pres);

    console.log("this.props:", this.props);
    this.renderSlides(this.props);


	}

  renderSlides(props){
    console.log('[SWIK] Calling renderSlides()');
    console.log(this.pres);
    ReactDOM.render(this.pres, ReactDOM.findDOMNode(this));
    console.log('[SWIK] Calling Reveal.initialize()');
    Reveal.initialize();
    console.log('[SWIK] Called Reveal.initialize()');

  }

	render(){

		return <div />;
	}
	// render(){
	// 	return <Slides />;
	// }
}

Presentation = connectToStores(Presentation, [PresentationStore], (context, props) => {
    return {
    };
});


export default Presentation;
