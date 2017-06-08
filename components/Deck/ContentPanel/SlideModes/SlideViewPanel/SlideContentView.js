import React from 'react';
import ResizeAware from 'react-resize-aware';
import {findDOMNode} from 'react-dom';
const ReactDOM = require('react-dom');

class SlideContentView extends React.Component {

    render() {
        //styles should match slideContentEditor for consistency
        const compHeaderStyle = {
            minWidth: '100%',
            overflowY: 'auto',
            position: 'relative'
        };
        const compStyle = {
            //minWidth: '100%',
            // maxHeight: 450,
            minHeight: 600,
            //minHeight: '100%',
            overflowY: 'auto',
            overflowX: 'auto',
            //overflowY: 'visible',
            //overflow: 'hidden,'
            position: 'relative'
        };
        const sectionElementStyle = {
            overflowY: 'hidden',
            overflowX: 'auto',
            //paddingTop: 40,
            height: '100%'
        };
        const contentStyle = {
            minWidth: '100%',
            // maxHeight: 450,
            minHeight: 610,
            overflowY: 'auto',
            overflowX: 'auto',
            //borderStyle: 'dashed',
            //borderColor: '#e7e7e7',
        };
        const compSpeakerStyle = {
            maxHeight: 50,
            minHeight: 50,
            overflowY: 'auto',
            position: 'relative'
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
        //console.log(style);
        //console.log(style.reveal);
        //console.log(style.slides);
        // HACK CSS Modules theme needs to get to be used for the .titleSlide and .bodySlide in the [text] HTML we load

        let slideContent = this.props.content;
        if(slideContent && typeof slideContent !== 'undefined'){
            slideContent = slideContent.replace('class="titleSlide"', 'class="titleSlide ' + styleName.titleSlide + '"');
            slideContent = slideContent.replace('class="bodySlide"', 'class="bodySlide ' + styleName.bodySlide + '"');
        }

        return (
        <ResizeAware ref='container' id='container'>
            <div ref="slideContentView" className="ui" style={compStyle}>
                <div className={['reveal', style.reveal].join(' ')}>
                    <div className={['slides', style.slides].join(' ')}>
                        <section className="present" style={sectionElementStyle}>
                            <div style={contentStyle} name='inlineContent' ref='inlineContent' id='inlineContent'
                                 dangerouslySetInnerHTML={{__html:slideContent}}></div>
                        </section>
                    </div>
                    <br />
                </div>
            </div>
            <div ref="slideContentViewSpeakerNotes" className="ui" style={compSpeakerStyle}>
                {this.props.speakernotes ? <b>Speaker notes:</b> : ''}
                <div dangerouslySetInnerHTML={{__html: this.props.speakernotes}}/>
            </div>
        </ResizeAware>
        );
    }

    componentDidMount(){

        if(process.env.BROWSER){


            //Function toi fit contents in edit and view component
            //$(".pptx2html").addClass('schaal');
            //$(".pptx2html [style*='absolute']").addClass('schaal');
            /*
            if ($('.pptx2html').length)
            {
                $(".pptx2html").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                //$("#signinModal").css({'zIndex': '99999', 'position': 'absolute'});

            } else {
                //do nothing - relative content scales anyways.
                //$(".slides").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                //$("#signinModal").css({'zIndex': '99999', 'position': 'absolute'});
            }
            */
            //initial resize
            this.resize();
            ReactDOM.findDOMNode(this.refs.container).addEventListener('resize', (evt) =>
                {
                //console.log('resize');
                this.resize();
            });
        }
        this.forceUpdate();
    }

    componentDidUpdate() {
        // update mathjax rendering
        // add to the mathjax rendering queue the command to type-set the inlineContent
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,'inlineContent']);

        this.resize();
    }

    componentWillReceiveProps(nextProps){
        // alert('styleName in componentWillReceiveProps: ' + styleName);
        // console.log(this.props.PresentationStore);
        if (nextProps.theme === this.props.theme){

        }
    }

    resize()
    {
        let containerwidth = document.getElementById('container').offsetWidth;
        let containerheight = document.getElementById('container').offsetHeight;
        //console.log('Component has been resized! Width =' + containerwidth + 'height' + containerheight);

        //reset scaling of pptx2html element to get original size
        $('.pptx2html').css({'transform': '', 'transform-origin': ''});

        //Function to fit contents in edit and view component
        let pptxwidth = $('.pptx2html').width();
        let pptxheight = $('.pptx2html').height();

        //only calculate scaleration for width for now
        this.scaleratio = containerwidth / (pptxwidth+50);
        //console.log(containerwidth);
        //console.log(pptxwidth);

        if ($('.pptx2html').length)
        {
            $('.pptx2html').css({'transform': '', 'transform-origin': ''});
            $('.pptx2html').css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});

            //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
            //width = pptxwidth + 40
            //height + 40
            //this.refs.slideContentView.style.width = ((pptxwidth + 40) * this.scaleratio) + 'px';
            //this.refs.slideContentView.style.padding = '20px 20px 20px 20px';
            //$(".pptx2html").css({'padding': '20px 20px 20px 20px'});
            //style.padding left = 20 px, top 20 px
            //this.refs.slideContentView.style.height = ((pptxheight + 0 + 20) * this.scaleratio) + 'px';
            //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
            this.refs.slideContentView.style.height = ((pptxheight + 5 + 20) * this.scaleratio) + 'px';
            this.refs.inlineContent.style.height = ((pptxheight + 0 + 20) * this.scaleratio) + 'px';

            //show that content is outside of pptx2html box (alternative to ridge: groove)
            //$('.pptx2html').css({'borderStyle': 'ridge ridge ridge ridge', 'borderColor': '#7AB0D7', 'box-shadow': '0px 0px 1000px #E28447'});
            $('.pptx2html').css({'borderStyle': 'double', 'borderColor': '#DA6619'});
            //all borders
            //$(".pptx2html").css({'borderStyle': 'double double double double ', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});
        }
    }
}

SlideContentView.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SlideContentView;
