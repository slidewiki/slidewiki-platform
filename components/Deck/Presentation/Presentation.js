import React from 'react';
import ReactDOM from 'react-dom'
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
//import PresentationSlideList from './PresentationSlideList';
import PresentationSlide from './PresentationSlide';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import PresentationStore from '../../../stores/PresentationStore';
import loadPresentation from '../../../actions/loadPresentation';

var playerCss = {
    height: '100%',
    fontSize: '100%',
    position: 'absolute',
    top: '0',
    //backgroundColor: '#ffffff',
    zindex: '1000'
};

var clearStyle = {
    clear: 'both'
}

if (process.env.BROWSER) {
    let s = 'white';
    require('../../../bower_components/reveal.js/css/reveal.css');
    console.log("requiring");
}


class Presentation extends React.Component{
    constructor(props){
        super(props);
        this.playerCss = playerCss;
        this.slides = [];
    }
    componentWillMount(){
        this.context.executeAction(loadPresentation, {
            deck: this.props.DeckTreeStore.flatTree
        });

    }

    componentDidUpdate(){
        console.log(this.slides);
        console.log('componentDidMount');
	    if(this.slides.length > 0){
			Reveal.initialize();
            if (process.env.BROWSER) {
                console.log(this.props.PresentationStore);
                let s = this.props.PresentationStore.theme;
                require('../../../bower_components/reveal.js/css/theme/' + s + '.css');
                console.log("requiring");
                console.log(this.playerCss.background);
                //while(this.playerCss.background === undefined || this.playerCss.background === ''){
                while(!this.playerCss.background){
                    //console.log(this.playerCss.background);
                    this.updateStyleForTheme();
                    this.forceUpdate();
                    // console.log(this.playerCss.background);
                    // console.log('state: ', this.state);
                }
                // var updateStyle = setInterval(function(){
                //     updateStyleForTheme();
                // }, 100);

            }
		}
    }

	render(){
        console.log("Rendering");
        this.slides = this.getSlides();
        return(
            <div>
                <div className="reveal" style={this.playerCss}>
                    <div className="slides">
        				{this.slides}
        			</div>
                </div>
                <br style={clearStyle} />
            </div>
        );
	}

    updateStyleForTheme(){
        //This function gets the background from body (where reveal puts it), and places it into this component.
        //Needed to make it properly full screen
        let style = window.getComputedStyle(document.getElementsByTagName('body')[0]);
        let background = style.background;
        this.playerCss.background = background;
        // this.setState({playerCss: this.playerCss});
    }


    getSlides(){
        var slides = this.props.PresentationStore.content;

        var returnList = [];
        if(slides !== ''){
                for (var i = 0; i < slides.length; i++) {
                    let speakerNotes = slides[i]['speakerNotes'];
                    let content = slides[i]['content'] + '<aside class="notes">' + speakerNotes + '</aside>';

                    returnList.push(<PresentationSlide content={content} speakerNotes={speakerNotes}  key={i} />);
                }

          return returnList;

        }
        else{
            return (<section />);
        }
    }

}

Presentation.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

Presentation = connectToStores(Presentation, [DeckTreeStore, PresentationStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        PresentationStore: context.getStore(PresentationStore).getState()
    };
});


export default Presentation;
