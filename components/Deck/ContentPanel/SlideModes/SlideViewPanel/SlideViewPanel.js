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
            // maxHeight: 450,
            minHeight: 450,
            overflowY: 'auto',
            position: 'relative',
            overflow: 'hidden'
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
                      {this.props.SlideViewStore.speakernotes ? <b>Speaker Notes:</b> : ''}
                      <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.speakernotes}} />
                  </div>
              </ResizeAware>
        </div>
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

        //let pptxwidth = document.getElementByClassName('pptx2html').offsetWidth;
        //let pptxheight = document.getElementByClassName('pptx2html').offsetHeight;
        let pptxwidth = $('.pptx2html').width();
        let pptxheight = $('.pptx2html').height();
        //console.log('pptx2html Width =' + pptxwidth + 'height' + pptxheight);

        //only calculate scaleration for width for now
        if (containerwidth > pptxwidth)
        {
            this.scaleratio = pptxwidth / containerwidth;
            //console.log(this.scaleratio);
            //this.props.SlideEditStore.scaleratio = containerwidth / pptxwidth;
            //let scaleratio = containerwidth / pptxwidth;
        } else {
            this.scaleratio = containerwidth / pptxwidth;
            //console.log(this.scaleratio);
            //this.props.SlideEditStore.scaleratio = pptxwidth / containerwidth;
            //let scaleratio = pptxwidth / containerwidth;
        }
        //Function to fit contents in edit and view component
        //$(".pptx2html").addClass('schaal');
        //$(".pptx2html [style*='absolute']").addClass('schaal');
        //$(".pptx2html").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
        //$("#inlineContent").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
            if ($('.pptx2html').length)
            {
                //$(".pptx2html").css({'transform': 'scale(0.5,0.5)', 'transform-origin': 'top left'});
                //$(".pptx2html").css({'transform': 'scale('+scaleratio+','+scaleratio+')', 'transform-origin': 'top left'});
                //$(".pptx2html").css({'transform': 'scale('+this.props.SlideEditStore.scaleratio+','+this.props.SlideEditStore.scaleratio+')', 'transform-origin': 'top left'});
                $(".pptx2html").css({'transform': '', 'transform-origin': ''});
                $(".pptx2html").css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});
            }
    }
}

SlideViewPanel = connectToStores(SlideViewPanel, [SlideViewStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState()
    };
});
export default SlideViewPanel;
