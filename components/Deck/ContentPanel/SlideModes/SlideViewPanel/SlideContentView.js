import React from 'react';
//import ResizeAware from 'react-resize-aware';
import {findDOMNode} from 'react-dom';
const ReactDOM = require('react-dom');

class SlideContentView extends React.Component {
    constructor(props) {
        super(props);
        this.loading = 'loading';
    }
    componentWillReceiveProps(nextProps){
        // alert('styleName in componentWillReceiveProps: ' + styleName);
        // console.log(this.props.PresentationStore);
        if (nextProps.theme === this.props.theme){

        }
        //console.log('componentWillReceiveProps ' + this.props.loadingIndicator + nextProps.loadingIndicator);
        if (nextProps.loadingIndicator !== this.props.loadingIndicator)
        {
            if (nextProps.loadingIndicator === 'true')
                this.loading = 'loading';
            if(nextProps.loadingIndicator === 'false')
                this.loading = '';
        }
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.handleResize);
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
            this.resize(true);
            $('.pptx2html').css({'margin': 'auto'});
            window.addEventListener('resize', this.handleResize);
            /*ReactDOM.findDOMNode(this.refs.container).addEventListener('onResize', (evt) =>
                {
                console.log('onresize');
                this.resize();
            });*/
            this.loading = '';
        }
        this.forceUpdate();
    }
    handleResize = () => {
        this.forceUpdate();
    }
    componentDidUpdate() {
        // update mathjax rendering
        // add to the mathjax rendering queue the command to type-set the inlineContent
        MathJax.Hub.Queue(['Typeset',MathJax.Hub,'inlineContent']);
        this.resize(false);

        //this.loading = '';
        //console.log('componentDidUpdate');
    }

    resize(initialResize)
    {
        if ($('.pptx2html').length)
        {
            let containerwidth = document.getElementById('slideContainer').offsetWidth;
            let containerheight = document.getElementById('slideContainer').offsetHeight;
            console.log(containerwidth);
            if(initialResize === true)
            {
                //Function to fit contents in edit and view component
                let pptxwidth = $('.pptx2html').width();
                console.log(pptxwidth);
                let pptxheight = $('.pptx2html').height();

                //this.scaleratio = containerwidth / (pptxwidth+50);
                //this.vScaleratio = containerheight / (pptxheight+100);
                this.scaleratio = containerwidth / (pptxwidth);
                this.vScaleratio = containerheight / (pptxheight);
                //console.log(containerwidth);
                //reset scaling of pptx2html element to get original size
                $('.pptx2html').css({'transform': '', 'transform-origin': ''});
                let scaleratio;
                if (this.vScaleratio < this.scaleratio)
                {scaleratio = this.vScaleratio;}
                else {scaleratio = this.scaleratio;}
                console.log('initial' + this.scaleratio + this.vScaleratio);
                $('.pptx2html').css({'transform': '', 'transform-origin': ''});
                $('.pptx2html').css({'transform': 'scale('+scaleratio+','+scaleratio+')', 'transform-origin': 'top left'});
            }


            //show that content is outside of pptx2html box (alternative to ridge: groove)
            //$('.pptx2html').css({'borderStyle': 'ridge ridge ridge ridge', 'borderColor': '#7AB0D7', 'box-shadow': '0px 0px 1000px #E28447'});
            $('.pptx2html').css({'borderStyle': 'double', 'borderColor': '#DA6619'});
            //all borders
            //$(".pptx2html").css({'borderStyle': 'double double double double ', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});

            //Function to fit contents in edit and view component
            let pptxwidth = $('.pptx2html').width();
            let pptxheight = $('.pptx2html').height();

            //this.scaleratio = containerwidth / (pptxwidth+50);
            //this.vScaleratio = containerheight / (pptxheight+100);
            this.scaleratio = containerwidth / (pptxwidth);
            this.vScaleratio = containerheight / (pptxheight);
            //console.log(containerwidth);
            //console.log(pptxwidth);
            //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
            //width = pptxwidth + 40
            //height + 40
            //this.refs.slideContentView.style.width = ((pptxwidth + 40) * this.scaleratio) + 'px';
            //this.refs.slideContentView.style.padding = '20px 20px 20px 20px';
            //$(".pptx2html").css({'padding': '20px 20px 20px 20px'});
            //style.padding left = 20 px, top 20 px
            //this.refs.slideContentView.style.height = ((pptxheight + 0 + 20) * this.scaleratio) + 'px';
            //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
            this.refs.slideContentView.style.height = ((pptxheight + 10 + 20) * this.vScaleratio) + 'px';
            this.refs.inlineContent.style.height = ((pptxheight + 0 + 0) * this.vScaleratio) + 'px';
            //console.log('Component has been resized! Width =' + containerwidth + 'height' + containerheight);
        }
    }

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
            minHeight: 740,
            //minHeight: '100%',
            overflowY: 'auto',
            overflowX: 'auto',
            //overflowY: 'visible',
            //overflow: 'hidden,'
            position: 'relative'
        };
        const sectionElementStyle = {
            overflowY: 'auto',
            overflowX: 'auto',
            //paddingTop: 40,
            height: '100%'
        };
        const contentStyle = {
            minWidth: '100%',
            // maxHeight: 450,
            //borderStyle: 'dashed',
            //borderColor: '#e7e7e7',
        };
        const compSpeakerStyle = {
            minHeight: 50,
            overflowY: 'auto',
            position: 'relative',
            resize: 'vertical'
        };
        const SpeakerStyle = {
            minWidth: '100%',
            minHeight: 60,
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
        //console.log(style);
        //console.log(style.reveal);
        //console.log(style.slides);

        return (
        //<ResizeAware ref='container' id='container' style={{ position: 'relative' }}>
        <div ref='container' id='container'>
            <div ref='slideContainer' id='slideContainer'>
                {(this.loading === 'loading') ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
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
            </div>
            <div ref="slideContentViewSpeakerNotes" className="ui" style={compSpeakerStyle}>
                {this.props.speakernotes ? <b>Speaker notes:</b> : ''}
                <div style={SpeakerStyle} name='inlineSpeakerNotes' ref='inlineSpeakerNotes' id='inlineSpeakerNotes'  dangerouslySetInnerHTML={{__html: this.props.speakernotes}} tabIndex="0">
                </div>
            </div>
        </div>
        );
    }
}

SlideContentView.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SlideContentView;
