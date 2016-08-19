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
};

let clearStyle = {
    clear: 'both'
};


class Presentation extends React.Component{
    constructor(props){
        super(props);
        this.playerCss = playerCss;
        this.slides = [];
    }
    componentDidMount(){
        if(process.env.BROWSER){
            let style = require('../../../bower_components/reveal.js/css/reveal.css');
            //Hide the header and footer
            $('.ui.footer.sticky.segment').css({'display': 'none'});
            $('.ui.page.grid.inverted.blue.menu').css({'display': 'none'});
            $('.ui.footer.sticky.segment').attr({'aria-hidden': 'hidden', 'hidden': 'hidden'});
            $('.ui.page.grid.inverted.blue.menu').attr({'aria-hidden': 'hidden', 'hidden': 'hidden'});

            let s = this.props.PresentationStore.theme;
            console.log("PresentationStore", this.props.PresentationStore);
            if(!s){
                s = 'white';
            }
            require('../../../bower_components/reveal.js/css/theme/' + s + '.css');
            Reveal.initialize({
                dependencies: [
                // //{ src: 'socket.io/socket.io.js', async: true },
                    { src: '/bower_components/reveal.js/plugin/notes/notes.js', async: true }
                ]
            });
            console.log('componentDidMount');
        }
    }

    componentDidUpdate(){
        let s = this.props.PresentationStore;
        console.log('PresentationStore componentDidUpdate', s);
        // if(!s){
        //     s = 'white';
        // }
    }
    //     console.log('componentDidUpdate');
    //     if(this.slides.length > 0){
    //
    //         if (process.env.BROWSER) {
    //
    //             // let s = this.props.PresentationStore.theme;
    //             // require('../../../bower_components/reveal.js/css/theme/' + s + '.css');
    //             // Reveal.initialize({
    //             //     dependencies: [
    //             //     // //{ src: 'socket.io/socket.io.js', async: true },
    //             //         { src: '/bower_components/reveal.js/plugin/notes/notes.js', async: true }
    //             //     ]
    //             // });
    //
    //
    //         }
    //     }
    // }
    render(){
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

    getSlides(){
        let slides = this.props.PresentationStore.content;
        //console.log("PresentationStore", this.props.PresentationStore);

        let returnList = [];
        if(slides){
            console.log('slides');
            for (let i = 0; i < slides.length; i++) {
                let slide = slides[i];
                let speakerNotes = '';// slide.speakerNotes;
                let content = slide.title + slide.content + '<aside class="notes">' + speakerNotes + '</aside>';
                returnList.push(<PresentationSlide content={content} speakerNotes={speakerNotes}  key={slide.id} id={slide.id} />);
            }
            return returnList;

        }
        else{
            console.log('Not slides');
            return (<section />);
        }
    }

}

Presentation.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

Presentation = connectToStores(Presentation, [PresentationStore], (context, props) => {
    return {
        PresentationStore: context.getStore(PresentationStore).getState()
    };
});


export default Presentation;
