import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideViewStore from '../../../../../stores/SlideViewStore';
import ResizeAware from 'react-resize-aware';
import { findDOMNode } from 'react-dom';
const ReactDOM = require('react-dom');

class SlideViewPanel extends React.Component {
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
            minHeight: 450,
            //minHeight: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            //overflowY: 'visible',
            //overflow: 'hidden,'
            position: 'relative'
        };
        const compSpeakerStyle = {
            maxHeight: 50,
            minHeight: 50,
            overflowY: 'auto',
            position: 'relative'
        };

        const containerMinHeight = {

        }


        return (
          <div className="ui bottom attached segment">
              <ResizeAware ref='container' id='container'>
                  <div ref="slideViewPanel" className="ui" style={compStyle}>
                      <div className="reveal">
                          <div className="slides">
                              <div id="inlineContent" dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.content}} />
                          </div>
                          <br />
                      </div>
                  </div>
                  <div ref="slideViewPanelSpeakerNotes" className="ui" style={compSpeakerStyle}>
                      {this.props.SlideViewStore.speakernotes ? <b>Speaker notes:</b> : ''}
                      <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.speakernotes}} />
                  </div>
              </ResizeAware>
        </div>
        );
    }
    componentDidMount(){
      // Create the charts
      $("div[id^=chart]").each(function(){
         //console.log('////////////////////////////////////////////chartID');
         //console.log(JSON.parse($(this).attr('datum')));
         //console.log('////////////////////////////////////////////chartID');
         // Extract the data of the chartID
         let chart = JSON.parse($(this).attr('datum'));
         let chartID = chart.data['this.chartID'];
         let chartType =  chart.data.chartType;
         let chartData = chart.data.chartData;
         let data = null;
         chart = null;
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
            case 'pie3DChart':
                data = chartData[0].values;
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
                    break;
            default:
        }

        if (chart !== null) {

          d3.select('#' + chartID)
            .append('svg')
            .datum(chartData)
            .transition().duration(500)
            .call(chart);

          // nv.utils.windowResize(chart.update);
        }
      });

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
            this.resize()
            ReactDOM.findDOMNode(this.refs.container).addEventListener('resize', (evt) =>
                {
                //console.log('resize');
                this.resize();
            });
        }
        this.forceUpdate();
    }
    componentDidUpdate() {
        this.resize();
    }
    resize()
    {
        let containerwidth = document.getElementById('container').offsetWidth;
        let containerheight = document.getElementById('container').offsetHeight;
        //console.log('Component has been resized! Width =' + containerwidth + 'height' + containerheight);

        //reset scaling of pptx2html element to get original size
        $(".pptx2html").css({'transform': '', 'transform-origin': ''});

        //Function to fit contents in edit and view component
        let pptxwidth = $('.pptx2html').width();
        let pptxheight = $('.pptx2html').height();

        //only calculate scaleration for width for now
        this.scaleratio = containerwidth / pptxwidth;

        if ($('.pptx2html').length)
        {
            $(".pptx2html").css({'transform': '', 'transform-origin': ''});
            $(".pptx2html").css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});

            //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
            //width = pptxwidth + 40
            //height + 40
            //this.refs.slideViewPanel.style.width = ((pptxwidth + 40) * this.scaleratio) + 'px';
            //this.refs.slideViewPanel.style.padding = '20px 20px 20px 20px';
            //$(".pptx2html").css({'padding': '20px 20px 20px 20px'});
            //style.padding left = 20 px, top 20 px
            this.refs.slideViewPanel.style.height = ((pptxheight + 0 + 20) * this.scaleratio) + 'px';

            $(".pptx2html").css({'borderStyle': 'none none double none ', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});
            //all borders
            //$(".pptx2html").css({'borderStyle': 'double double double double ', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});
        }
    }
}

SlideViewPanel = connectToStores(SlideViewPanel, [SlideViewStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState()
    };
});
export default SlideViewPanel;
