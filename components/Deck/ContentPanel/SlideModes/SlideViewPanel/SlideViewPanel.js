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
        return (
          <div className="ui bottom attached segment">
              <div ref="slideViewPanelHeader" className="ui" style={compHeaderStyle} dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.title}} >
              </div>

              <div ref="slideViewPanel" className="ui" style={compStyle} dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.content}} >
              </div>

              <div ref="slideViewPanelSpeakerNotes" className="ui" style={compSpeakerStyle}>
                  {this.props.SlideViewStore.speakernotes ? <b>Speaker Notes:</b> : ''}
                  <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.speakernotes}} />
              </div>
            </div>
        );
    }
}

SlideViewPanel = connectToStores(SlideViewPanel, [SlideViewStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState()
    };
});
export default SlideViewPanel;
