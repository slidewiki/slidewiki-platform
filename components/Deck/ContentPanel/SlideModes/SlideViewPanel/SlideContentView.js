import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';
import ChartRender from '../../util/ChartRender';
import {connectToStores} from 'fluxible-addons-react';
import SlideViewStore from '../../../../../stores/SlideViewStore';
const ReactDOM = require('react-dom');

class SlideContentView extends React.Component {
    constructor(props) {
        super(props);
        this.scaleRatio = null;
        this.currentContent;

        this.resize = this.resize.bind(this);
    }
    componentWillReceiveProps(nextProps){
        if (this.currentContent !== this.props.content) {
            this.currentContent = this.props.content;
        }

        if (nextProps.SlideViewStore.scaleRatio && nextProps.SlideViewStore.scaleRatio !== this.scaleRatio) {
            this.scaleRatio = nextProps.SlideViewStore.scaleRatio;
            this.resize();
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

        // Resize of charts only necessary here.
        ChartRender.renderCharts(true);
    }

    componentDidUpdate() {
        ChartRender.renderCharts(false);
        // update mathjax rendering
        // add to the mathjax rendering queue the command to type-set the inlineContent
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,'inlineContent']);
        this.resize();
    }

    resize()
    {
        if ($('.pptx2html').length) {
            const containerwidth = document.getElementById('container').offsetWidth;

            $('.pptx2html').css({'transform': '', 'transform-origin': ''});

            const pptxwidth = $('.pptx2html').outerWidth();
            const padding = 12;

            if (!this.scaleRatio) {
                this.scaleRatio = containerwidth / (pptxwidth + padding);
            }
            $('.pptx2html').css({'transform': '', 'transform-origin': ''});
            $('.pptx2html').css({'transform': 'scale(' + this.scaleRatio + ', ' + this.scaleRatio + ')',
                'transform-origin': 'top left'});
            $('.pptx2html').css({'borderStyle': 'double', 'borderColor': 'rgba(218,102,25,0.5)'});

            const pptxheight = $('.pptx2html').outerHeight();
            const scrollbarHeight = this.refs.inlineContent.offsetHeight - this.refs.inlineContent.clientHeight;
            const contentHeight = pptxheight * this.scaleRatio;
            const contentWidth = pptxwidth * this.scaleRatio;

            this.refs.slideContentView.style.height = contentHeight + padding + 'px';
            this.refs.inlineContent.style.overflowY = 'hidden';
            this.refs.inlineContent.style.overflowX = 'hidden';

            /* Some extra padding is added to ensure that the borderline is visible. */
            this.refs.inlineContent.style.height = contentHeight + 'px';
            this.refs.inlineContent.style.width = contentWidth + 'px';
        } else {
            this.refs.inlineContent.style.overflowY = 'scroll';
            this.refs.inlineContent.style.height = '100%';
        }
    }

    render() {
        //styles should match slideContentEditor for consistency
        const compHeaderStyle = {
            overflowY: 'auto',
            position: 'relative'
        };
        const compStyle = {
            overflowY: 'auto',
            overflowX: 'auto',
            position: 'relative'
        };
        const sectionElementStyle = {
            overflowY: 'hidden',
            overflowX: 'auto',
            height: '100%',
            padding: 0,
        };
        const contentStyle = {
            overflowY: 'hidden',
            overflowX: 'hidden',
        };
        const compSpeakerStyle = {
            overflowY: 'auto',
            position: 'relative',
            paddingLeft: '5px'
        };
        const SpeakerStyle = {
            minHeight: '85px',
            overflowY: 'auto',
            overflowX: 'auto',
            position: 'relative',
            resize: 'vertical'
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
        //to handle non-canvas display of slides
        let slideHTMLContent = this.props.content;
        if (slideHTMLContent.indexOf('class="pptx2html"') === -1 && slideHTMLContent.indexOf('class=\'pptx2html\'') === -1) {
            slideHTMLContent = '<div class="pptx2html" style="width: 960px; position: relative; ">' + slideHTMLContent + '</div>';
        }
        return (
        <div ref='container' id='container'>
            <div ref="slideContentView" className="ui" style={compStyle}>
                <div className={['reveal', style.reveal].join(' ')}>
                    <div className={['slides', style.slides].join(' ')}>
                        <section className="present" style={sectionElementStyle}>
                            <div style={contentStyle} name='inlineContent' ref='inlineContent' id='inlineContent' tabIndex="0"
                                 dangerouslySetInnerHTML={{__html: slideHTMLContent}}>
                            </div>
                        </section>
                    </div>
                    <br />
                </div>
            </div>
            {this.props.hideSpeakerNotes ? null :
                <div className="ui horizontal segments">
                      <div ref="slideContentViewSpeakerNotes" className="ui segment vertical attached left" style={compSpeakerStyle}>
                          <b>Speaker notes:</b>
                          <div style={SpeakerStyle} name='inlineSpeakerNotes' ref='inlineSpeakerNotes' id='inlineSpeakerNotes'  dangerouslySetInnerHTML={{__html: this.props.speakernotes}} tabIndex="0">
                          </div>
                      </div>
                </div>
            }
        </div>
        );
    }
}

SlideContentView.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

SlideContentView = connectToStores(SlideContentView, [SlideViewStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState(),
    };
});

export default SlideContentView;
