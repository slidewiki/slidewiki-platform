import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideViewStore from '../../../../../stores/SlideViewStore';

class SlideViewPanel extends React.Component {
    render() {
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
            <div className="column">
                <div ref="slideViewPanel" className="ui segment">
                    <div class="content" tabIndex="0">
                        <a href="http://google.com" className="ui small image" tabIndex="-1">
                            <img src="assets/images/wireframe/image.png" alt="thumbnail of slide" />
                        </a>
                        <a className="header">Slide B</a>
                        <div className="description">Slide 4 of 30</div>
                      <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.title}} />
                      <div dangerouslySetInnerHTML={{__html:this.props.SlideViewStore.content}} />
                     </div>
                </div>
            </div>
        /*

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
        */
        );
    }
}

SlideViewPanel = connectToStores(SlideViewPanel, [SlideViewStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState()
    };
});
export default SlideViewPanel;
