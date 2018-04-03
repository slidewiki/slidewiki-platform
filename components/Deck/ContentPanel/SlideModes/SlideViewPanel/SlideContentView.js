import React from 'react';
import {findDOMNode} from 'react-dom';
const ReactDOM = require('react-dom');

class SlideContentView extends React.Component {
    constructor(props) {
        super(props);
        this.loading = 'loading';
        this.zoom = 1.0;
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.theme === this.props.theme){

        }
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


            this.resize();
            window.addEventListener('resize', this.handleResize);
            this.renderCharts();
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
    }

    resize()
    {
        //reset scaling of pptx2html element to get original size
        $('.pptx2html').css({'transform': '', 'transform-origin': ''});

        //Function to fit contents in edit and view component
        let pptxwidth = $('.pptx2html').outerWidth();
        let pptxheight = $('.pptx2html').outerHeight();

        //only calculate scaleration for width for now
        this.scaleratio = this.zoom;

        if ($('.pptx2html').length)
        {
            $('.pptx2html').css({'transform': '', 'transform-origin': ''});
            $('.pptx2html').css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});

            pptxheight = $('.pptx2html').outerHeight();

            const scrollbarHeight = this.refs.inlineContent.offsetHeight - this.refs.inlineContent.clientHeight;
            this.refs.slideContentView.style.height = (pptxheight * this.scaleratio + scrollbarHeight) + 'px';

            $('.pptx2html').css({'borderStyle': 'double', 'borderColor': '#DA6619'});
        }
    }
    zoomIn(){
        this.zoom += 0.25;
        this.resize();
    }
    resetZoom(){
        this.zoom = 1;
        this.resize();
    }
    zoomOut(){
        this.zoom -= 0.25;
        this.resize();
    }

    renderCharts(){


        let charts = $('div[id^=chart]');

        for (let i = 0; i < charts.length; i++){


            let data = null;
            let chart = null;

            let jsonChart = JSON.parse( charts[i].getAttribute('datum'));

            let chartID = jsonChart.chartID;
            let chartType = jsonChart.chartType;
            let chartData = jsonChart.chartData;


            switch (chartType) {
                case 'lineChart':
                    data = chartData;
                    chart = nv.models.lineChart()
                        .useInteractiveGuideline(true);
                    chart.xAxis.tickFormat(function(d) { return chartData[0].xlabels[d] || d; });
                    break;
                case 'barChart':
                    data = chartData;
                    chart = nv.models.multiBarChart();
                    chart.xAxis.tickFormat(function(d) { return chartData[0].xlabels[d] || d; });
                    break;
                case 'pieChart':
                    chartData = chartData[0].values;
                    chart = nv.models.pieChart();
                    break;
                case 'pie3DChart':
                    chartData = chartData[0].values;
                    chart = nv.models.pieChart();
                    break;
                case 'areaChart':
                    data = chartData;
                    chart = nv.models.stackedAreaChart()
                        .clipEdge(true)
                        .useInteractiveGuideline(true);
                    chart.xAxis.tickFormat(function(d) { return chartData[0].xlabels[d] || d; });
                    break;
                case 'scatterChart':

                    for (let i=0; i<chartData.length; i++) {
                        let arr = [];
                        for (let j=0; j<chartData[i].length; j++) {
                            arr.push({x: j, y: chartData[i][j]});
                        }
                        data.push({key: 'data' + (i + 1), values: arr});
                    }

                    chart = nv.models.scatterChart()
                        .showDistX(true)
                        .showDistY(true)
                        .color(d3.scale.category10().range());
                    chart.xAxis.axisLabel('X').tickFormat(d3.format('.02f'));
                    chart.yAxis.axisLabel('Y').tickFormat(d3.format('.02f'));
                    chartData = data;
                    break;
                default:
            }


            if (chart !== null) {

                d3.select('#' + chartID)
                    .append('svg')
                    .datum(chartData)
                    .transition().duration(500)
                    .call(chart);

                nv.utils.windowResize(chart.update);

            }
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
            minHeight: 610,
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
            overflowY: 'hidden',
            overflowX: 'auto',
            height: '100%'
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
            <div className="ui horizontal segments">
                <div ref="slideContentViewSpeakerNotes" className="ui segment vertical attached left" style={compSpeakerStyle}>
                    {this.props.speakernotes ? <b>Speaker notes:</b> : ''}
                    <div style={SpeakerStyle} name='inlineSpeakerNotes' ref='inlineSpeakerNotes' id='inlineSpeakerNotes'  dangerouslySetInnerHTML={{__html: this.props.speakernotes}} tabIndex="0">
                    </div>
                </div>
                <div className="ui segment vertical attached left icon buttons">
                    <button className="ui button" onClick={this.zoomIn.bind(this)} type="button" aria-label="Zoom in" data-tooltip="Zoom in"><i className="stacked icons"><i className="small plus icon "></i><i className="large search icon "></i></i></button>
                    <button className="ui button" onClick={this.resetZoom.bind(this)} type="button" aria-label="reset zoom" data-tooltip="reset zoom"><i className="stacked icons"><i className="small compress icon "></i><i className="large search icon "></i></i></button>
                    <button className="ui button" onClick={this.zoomOut.bind(this)} type="button" aria-label="Zoom out" data-tooltip="Zoom out"><i className="stacked icons"><i className="small minus icon "></i><i className="large search icon "></i></i></button>
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
