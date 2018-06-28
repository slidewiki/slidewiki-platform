import React from 'react';
import {findDOMNode} from 'react-dom';
const ReactDOM = require('react-dom');

class SlideContentView extends React.Component {
    constructor(props) {
        super(props);
        this.scaleRatio;
        this.currentContent;
    }
    componentWillReceiveProps(nextProps){
        if (this.currentContent !== this.props.content)
        {
            this.currentContent = this.props.content;
            this.scaleRatio = 1;
        }
    }
    componentWillUnmount(){
        //window.removeEventListener('resize', this.handleResize);
    }
    componentDidMount(){
        if(process.env.BROWSER){
            //initial resize
            this.resize();
            //window.addEventListener('resize', this.handleResize);
        }
        this.forceUpdate();
    }

    componentDidUpdate() {
        // update mathjax rendering
        // add to the mathjax rendering queue the command to type-set the inlineContent
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,'inlineContent']);
        this.resize();
    }

    resize()
    {
        if ($('.pptx2html').length)
        {
            $('.pptx2html').css({'transform': 'scale('+this.scaleRatio+','+this.scaleRatio+')', 'transform-origin': 'top left'});
            $('.pptx2html').css({'borderStyle': 'double', 'borderColor': 'rgba(218,102,25,0.5)'});
            this.refs.inlineContent.style.overflowY = 'auto';
        }
        else {
            this.refs.inlineContent.style.overflowY = 'scroll';
        }
    }
    zoomIn(){
        this.scaleRatio += 0.25;
        this.resize();
    }
    resetZoom(){
        this.scaleRatio = 1;
        this.resize();
    }
    zoomOut(){
        this.scaleRatio -= 0.25;
        this.resize();
    }
    render() {
        //styles should match slideContentEditor for consistency
        const compHeaderStyle = {
            minWidth: '100%',
            overflowY: 'auto',
            position: 'relative'
        };
        const compStyle = {
            height: '720px',
            overflowY: 'auto',
            overflowX: 'auto',
            position: 'relative'
        };
        const sectionElementStyle = {
            overflowY: 'hidden',
            overflowX: 'hidden',
            height: '100%',
            padding: 0,
        };
        const contentStyle = {
            minWidth: '100%',
            height: '720px',
            overflowY: 'hidden',
            overflowX: 'auto',
        };
        const compSpeakerStyle = {
            overflowY: 'auto',
            position: 'relative',
            paddingLeft: '5px'
        };
        const SpeakerStyle = {
            minWidth: '100%',
            minHeight: 85,
            overflowY: 'auto',
            overflowX: 'auto',
            position: 'relative',
            resize: 'vertical'
        };
        const containerMinHeight = {

        };

        // Add the CSS dependency for the theme
        // Get the theme information, and download the stylesheet
        let styleName = 'default';
        if(this.props.theme && typeof this.props.theme !== 'undefined'){
            styleName = this.props.theme;
        }
        if (styleName === '' || typeof styleName === 'undefined' || styleName === 'undefined')
        {
            //if none of above yield a theme:
            styleName = 'white';
        }
        let style = require('../../../../../custom_modules/reveal.js/css/theme/' + styleName + '.css');

        return (
        <div ref='container' id='container'>
            <div ref="slideContentView" className="ui" style={compStyle}>
                <div className={['reveal', style.reveal].join(' ')}>
                    <div className={['slides', style.slides].join(' ')}>
                        <section className="present" style={sectionElementStyle}>
                            <div style={contentStyle} name='inlineContent' ref='inlineContent' id='inlineContent' tabIndex="0"
                                 dangerouslySetInnerHTML={{__html: this.props.content}}>
                            </div>
                        </section>
                    </div>
                    <br />
                </div>
            </div>
            <div className="ui horizontal segments">
                {this.props.hideSpeakerNotes ?  null
                  :
                  <div ref="slideContentViewSpeakerNotes" className="ui segment vertical attached left" style={compSpeakerStyle}>
                      {this.props.speakernotes ? <b>Speaker notes:</b> : ''}
                      <div style={SpeakerStyle} name='inlineSpeakerNotes' ref='inlineSpeakerNotes' id='inlineSpeakerNotes'  dangerouslySetInnerHTML={{__html: this.props.speakernotes}} tabIndex="0">
                      </div>
                  </div>
                }
                {this.props.hideSpeakerNotes ?  null
                  :
                  <div className="ui segment vertical attached left icon buttons">
                      <button className="ui button" onClick={this.zoomIn.bind(this)} type="button" aria-label="Zoom in" data-tooltip="Zoom in"><i className="stacked icons"><i className="small plus icon "></i><i className="large search icon "></i></i></button>
                      <button className="ui button" onClick={this.resetZoom.bind(this)} type="button" aria-label="Reset zoom" data-tooltip="reset zoom"><i className="stacked icons"><i className="small compress icon "></i><i className="large search icon "></i></i></button>
                      <button className="ui button" onClick={this.zoomOut.bind(this)} type="button" aria-label="Zoom out" data-tooltip="Zoom out"><i className="stacked icons"><i className="small minus icon "></i><i className="large search icon "></i></i></button>
                  </div>
                }

            </div>
        </div>
        );
    }
}

SlideContentView.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SlideContentView;
