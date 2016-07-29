import React from 'react';
import ReactDOM from 'react-dom'
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
//import PresentationSlideList from './PresentationSlideList';
import PresentationSlide from './PresentationSlide';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import PresentationStore from '../../../stores/PresentationStore';
import loadPresentation from '../../../actions/loadPresentation';

let playerCss = {
    height: '100%',
    fontSize: '100%',
    position: 'absolute',
    top: '0',
    //backgroundColor: '#ffffff',
    zindex: '1000'
};

let clearStyle = {
    clear: 'both'
};

if (process.env.BROWSER) {
    // let s = 'white';
    // let style = require('../../../bower_components/reveal.js/css/reveal.css');
    // console.log('requiring');
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

    componentDidMount(){
        let s = 'white';
        let style = require('../../../bower_components/reveal.js/css/reveal.css');
        //Hide the header and footer
        $('.ui.footer.sticky.segment').css({'display': 'none'});
        $('.ui.page.grid.inverted.blue.menu').css({'display': 'none'});
        $('.ui.footer.sticky.segment').attr({'aria-hidden': 'hidden', 'hidden': 'hidden'});
        $('.ui.page.grid.inverted.blue.menu').attr({'aria-hidden': 'hidden', 'hidden': 'hidden'});
    }

    componentDidUpdate(){
        if(this.slides.length > 0){

            if (process.env.BROWSER) {
                Reveal.initialize({
                    dependencies: [
                    // //{ src: 'socket.io/socket.io.js', async: true },
                        { src: '/bower_components/reveal.js/plugin/notes/notes.js', async: true }
                    ]
                });

                console.log(this.props.PresentationStore);
                let s = this.props.PresentationStore.theme;

                require('../../../bower_components/reveal.js/css/theme/' + s + '.css');

            }
        }
    }
    render(){
        console.log('Rendering');
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
        let slides = this.props.PresentationStore.content;

        let returnList = [];
        if(slides !== ''){
            for (let i = 0; i < slides.length; i++) {
                let slide = slides[i];
                let speakerNotes = slide.speakerNotes;
                let content = slide.title + slide.content + '<aside class="notes">' + speakerNotes + '</aside>';
                returnList.push(<PresentationSlide content={content} speakerNotes={speakerNotes}  key={slide.id} id={slide.id} />);
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
