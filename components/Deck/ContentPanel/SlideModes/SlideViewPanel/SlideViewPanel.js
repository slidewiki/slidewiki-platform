import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideViewStore from '../../../../../stores/SlideViewStore';
import ErrorStore from '../../../../../stores/ErrorStore';
import Error from '../../../../../components/Error/Error';

class SlideViewPanel extends React.Component {
    render() {
        if(this.props.ErrorStore.error) {
            return (
                <div ref="slideViewPanel">
                    <Error error={this.props.ErrorStore.error} />
                </div>
            );
        }
        else {
            const compStyle = {
                maxHeight: 500,
                minHeight: 500,
                overflowY: 'auto'
            };
            const compSpeakerStyle = {
                maxHeight: 50,
                minHeight: 50,
                overflowY: 'auto'
            };
            return (
              <div className="ui bottom attached segment">
                  <div ref="slideViewPanel" className="ui" style={compStyle}>
                      <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.title}} />
                      <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.content}} />
                  </div>

                  <div ref="slideViewPanelSpeakerNotes" className="ui" style={compSpeakerStyle}>
                      {this.props.SlideViewStore.speakernotes ? <b>Speaker Notes:</b> : ''}
                      <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.speakernotes}} />
                  </div>
                </div>
            );
        }
    }
}

SlideViewPanel = connectToStores(SlideViewPanel, [SlideViewStore, ErrorStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState(),
        ErrorStore: context.getStore(ErrorStore).getState(),
    };
});
export default SlideViewPanel;
