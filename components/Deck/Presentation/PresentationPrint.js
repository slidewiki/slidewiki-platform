import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import PresentationStore from '../../../stores/PresentationStore';
import DataSourceStore from '../../../stores/DataSourceStore';
import SlideContentView from '../../../components/Deck/ContentPanel/SlideModes/SlideViewPanel/SlideContentView';
import DataSourceList from '../../../components/Deck/ContentModulesPanel/DataSourcePanel/DataSourceList';

let playerCss = {
    height: '29.7cm',
    width: '21cm',
    // position: 'absolute',
    top: '0',
    fontSize: '100%'
};

let clearStyle = {
    clear: 'both'
};

//let pdf;
if(process.env.BROWSER){
    //pdf = require('../../../custom_modules/reveal.js/css/print/pdf.css');
}


class PresentationPrint extends React.Component{
    constructor(props){
        super(props);
        this.playerCss = playerCss;
        this.slides = [];
        this.startingSlide = this.props.PresentationStore.selector.sid;
        this.deck = this.props.PresentationStore.selector.id;
        this.revealDiv = null;
    }

    componentDidMount(){
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,'slides']);
        setTimeout(() => { window.print(); }, 2000);

    }

    componentDidUpdate(){

    }
    render(){
        this.slides = this.getSlides();
        return(
            <div id="presentationPrint">
                <div className="reveal-old" style={this.playerCss}  ref={(refToDiv) => this.revealDiv = refToDiv} data-transition="none" data-background-transition="none">
                    <div className="slides">
        			     	{this.slides}
        			      </div>
                </div>
                <br style={clearStyle} />
            </div>
        );
    }
    findSourcesForSlide(sid) {
        let items = this.props.DataSourceStore.dataSources.filter((source) => {
            return source.sid === sid;
        });
        return items;
    }
    getSlides(){
        //console.log(this.props.DataSourceStore);
        let slides = this.props.PresentationStore.content;
        const lastSlideContent = `
          <br/>
          <br/>
          <center>
          Creator:  <br/><br/>
          Contributors: <br/><br/><br/>
          Licensed under the Creative Commons <br/>Attribution ShareAlike CC-BY-SA license <br/>
          <br/><br/>
          This deck was created using <a href="http://slidewiki.org">SlideWiki</a>.<br/>
          <img src="/assets/images/slideWiki-logo-linear.png" style="width: 200px;"/>
          </center>
        `;
        let returnList = [];
        if(slides){
            for (let i = 0; i < slides.length; i++) {
                let slide = slides[i];
                let notes = '';
                let slideSources = '';
                let sources = this.findSourcesForSlide(slide.id);
                if(sources.length){
                    slideSources = <div><b>Sources</b>:<br/><DataSourceList items={sources} editable={false} selector ={slide.id}/></div>;
                }
                if(slide.speakernotes && slide.speakernotes.trim()){
                    notes =  '<aside class="notes">' + slide.speakernotes + '</aside>';
                }
                let content = slide.content + notes;
                returnList.push(<div key={slide.id + '-' + i} style={{'page-break-after' : 'always'}}><SlideContentView content={slide.content} speakernotes={notes} hideSpeakerNotes={slide.speakernotes && slide.speakernotes.trim()? false : true} theme={slide.theme}/>{slideSources}</div>);
            }
            //add last slide for licensing
            returnList.push(<div key={'end-slide'} style={{'page-break-after' : 'always'}}><SlideContentView content={lastSlideContent} speakernotes={''} hideSpeakerNotes={true} theme={''}/></div>);

            return returnList;

        }
        else{
            return (<section />);
        }
    }

}

PresentationPrint.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

PresentationPrint = connectToStores(PresentationPrint, [PresentationStore, DataSourceStore], (context, props) => {
    return {
        PresentationStore: context.getStore(PresentationStore).getState(),
        DataSourceStore: context.getStore(DataSourceStore).getState()
    };
});


export default PresentationPrint;
