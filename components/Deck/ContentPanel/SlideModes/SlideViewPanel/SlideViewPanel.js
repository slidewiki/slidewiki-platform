import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideViewStore from '../../../../../stores/SlideViewStore';

class SlideViewPanel extends React.Component {
    render() {
        //styles should match slideContentEditor for consistency
        const compHeaderStyle = {
            minWidth: '100%',
            overflowY: 'auto',
            position: 'relative'
        };
        const compStyle = {
            maxHeight: 450,
            minHeight: 450,
            overflowY: 'auto',
            position: 'relative'
        };
        const compSpeakerStyle = {
            maxHeight: 50,
            minHeight: 50,
            overflowY: 'auto',
            position: 'relative'
        };
        //TODO: We need to be able to change the colour based on the particular theme we're using
        // Reveal sets the background for body, here we need to specify it for just the slides.
        let revealSlideStyle = {
            // #222 is the colour for the 'black' theme
            //backgroundColor: '#222',

        };
        //TODO: We need to be able to change the colour based on the particular theme we're using
        // Reveal sets the background for body, here we need to specify it for just the slides.
        let revealSlideStyle = {
            // #222 is the colour for the 'black' theme
            //backgroundColor: '#222',

        };
        return (
          <div className="ui bottom attached segment">
              <div ref="slideViewPanel" className="ui" style={compStyle}>
                  <div className="reveal">
                      <div className="slides" style={revealSlideStyle}>
                          <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.title}} />
                          <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.content}} />
                      </div>
                  </div>
              </div>
              <div ref="slideViewPanelSpeakerNotes" className="ui" style={compSpeakerStyle}>
                  {this.props.SlideViewStore.speakernotes ? <b>Speaker Notes:</b> : ''}
                  <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.speakernotes}} />
              </div>
        </div>
        );
    }
    componentDidMount(){
        if(process.env.BROWSER){
            require('../../../../../bower_components/reveal.js/css/reveal.css');
            // Uncomment this to see with the different themes.  Assuming testing for PPTPX2HTML for now
            // Possible values: ['beige', 'black', 'blood', 'league', 'moon', 'night', 'serif', 'simple', 'sky', 'solarized', 'white']
            // require('../../../../../bower_components/reveal.js/css/theme/black.css');
            require('../../SetupReveal.css');


        }
    }
}

SlideViewPanel = connectToStores(SlideViewPanel, [SlideViewStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState()
    };
});
export default SlideViewPanel;
