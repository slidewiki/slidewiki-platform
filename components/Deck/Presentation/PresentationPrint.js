import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import PresentationStore from '../../../stores/PresentationStore';
import ContributorsStore from '../../../stores/ContributorsStore';
import DataSourceStore from '../../../stores/DataSourceStore';
import SlideContentView from '../../../components/Deck/ContentPanel/SlideModes/SlideViewPanel/SlideContentView';
import DataSourceList from '../../../components/Deck/ContentModulesPanel/DataSourcePanel/DataSourceList';
import ContributorsList from '../../../components/Deck/ContentModulesPanel/ContributorsPanel/ContributorsList';

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
        this.state ={offset: 0, threshold: 85};
    }

    componentDidMount(){
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,'slides']);
        setTimeout(() => { window.print(); }, 2000);

    }

    componentDidUpdate(){

    }
    handlePageClick(offset){
        this.setState({offset: offset});
        setTimeout(() => { window.print(); }, 2000);
    }
    render(){
        let slides = this.props.PresentationStore.content;
        let totalNoOfSlides = slides.length;
        let pageNumber = 1;
        let pagesDIV = '';
        if(totalNoOfSlides > this.state.threshold){
            // use paging to prevent browser crash
            pageNumber = Math.ceil(totalNoOfSlides / this.state.threshold);
            //console.log(pageNumber);
            let pages = [];
            for(let c= 0; c < pageNumber; c++){
                pages.push(<a key={c} className={'ui link circular label ' + ( c === this.state.offset ? 'grey' : 'white')} onClick={this.handlePageClick.bind(this, c)}>{c+1}</a>);
            }
            pagesDIV = <div><b>{pageNumber}</b> Pages: {pages}</div>;
            this.slides = this.getSlides(this.state.offset, this.state.threshold , this.state.offset === pageNumber -1 ? 1 : 0);
        }else{
            this.slides = this.getSlides(0, slides.length, 1);
        }

        return(
            <div id="presentationPrint" className="printView">
                <div className="reveal-old" style={this.playerCss}  ref={(refToDiv) => this.revealDiv = refToDiv} data-transition="none" data-background-transition="none">
                    <center>{pagesDIV}</center>
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
    prepareContributorName(contributor){
        let out = '';
        if(contributor.displayName){
            out = contributor.displayName;
        }else{
            out = contributor.username;
        }
        if(contributor.organization){
            out = out + ' (' + contributor.organization + ')';
        }
        return out;
    }
    getSlides(offset, threshold, isLast){
        //console.log(this.props.DataSourceStore);
        //console.log(this.props.ContributorsStore);
        let contributors = [];
        let creator = this.prepareContributorName(this.props.ContributorsStore.creator[0]);
        this.props.ContributorsStore.contributors.forEach((contrib) => {
            contributors.push(this.prepareContributorName(contrib));
        });
        let joinedContribs = contributors.join(', ');
        if(!joinedContribs.trim()){
            joinedContribs = ' - ';
        }
        let slides = this.props.PresentationStore.content;
        //the fake slide added at the end
        const lastSlideContent = `
          <br/>
          <br/>
          <center>
          Creator:  ${creator}<br/><br/>
          Contributors: <br/> ${joinedContribs}<br/><br/><br/>
          Licensed under the Creative Commons <br/>Attribution ShareAlike CC-BY-SA license <br/>
          <br/><br/>
          This deck was created using <a href="http://slidewiki.org">SlideWiki</a>.<br/>
          <div><img src="/assets/images/slidewiki.svg" style="width: 200px;"/></div>
          </center>
        `;
        let returnList = [];
        if(slides){
            let max = isLast ? slides.length : (offset * threshold) + threshold;
            for (let i = offset * threshold; i < max ; i++) {
                let slide = slides[i];
                let notes = '';
                let slideSources = '';
                let sources = this.findSourcesForSlide(slide.id);
                if(sources.length){
                    slideSources = <div className="ui segment"><b><i className="ui icon caret square up"></i> Sources</b><br/><DataSourceList items={sources} editable={false} selector ={slide.id}/></div>;
                }
                if(slide.speakernotes && slide.speakernotes.trim()){
                    notes = <div className="ui segment"><b><i className="ui icon caret square up"></i> Speaker Notes</b><div dangerouslySetInnerHTML={{__html: slide.speakernotes.replace('position: absolute;','')}}></div></div>;
                }
                let content = slide.content + notes;
                returnList.push(<div key={slide.id + '-' + i} style={{pageBreakAfter : 'always'}}><SlideContentView content={slide.content} speakernotes={notes} hideSpeakerNotes={true} theme={slide.theme}/>{slideSources}{notes}<br/></div>);
            }
            //add last slide for licensing
            if(isLast)
                returnList.push(<div key={'end-slide'} style={{pageBreakAfter : 'always'}}><SlideContentView content={lastSlideContent} speakernotes={''} hideSpeakerNotes={true} theme={''}/></div>);

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

PresentationPrint = connectToStores(PresentationPrint, [PresentationStore, DataSourceStore, ContributorsStore], (context, props) => {
    return {
        PresentationStore: context.getStore(PresentationStore).getState(),
        DataSourceStore: context.getStore(DataSourceStore).getState(),
        ContributorsStore: context.getStore(ContributorsStore).getState()
    };
});


export default PresentationPrint;
