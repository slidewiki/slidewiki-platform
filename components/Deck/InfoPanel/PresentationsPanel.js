import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import {isLocalStorageOn} from '../../../common.js';
import ReactList from 'react-list';

class PresentationsPanel extends React.Component {
    componentWillMount() {

    }

    renderItem(index, key) {
        let url = '/presentationbroadcast?room='+this.props.ActivityFeedStore.presentations[index]+'&presentation=/Presentation/'+this.props.ActivityFeedStore.selector.sid;
        return (
            <div className="ui item" key={key} style={{ margin: '1em 0'}}>
              <div className="ui feed">
                  <div className="event">
                      <div className="activity-icon">
                          <i className="ui large record icon"></i>
                      </div>
                      <div className="content" style={{marginLeft: '1em'}}>
                        <div className="summary">
                            <a target="_blank" href={url}>{this.props.ActivityFeedStore.presentations[index]}</a>
                        </div>
                      </div>
                  </div>
              </div>
            </div>
        );
    }

    render() {
        const panelDIVStyles = {
            maxHeight: 280,
            overflowY: 'auto'
        };

        return (
            <div ref="presentationPanel">
                <h5 className="ui small header" tabIndex="0">Presentations Feed (beta)
                    <i className="yellow warning sign icon"></i>
                </h5>
                <div className="ui basic semgment">
                    <button onClick={this.handlePresentationRoomClick.bind(this)} className="ui button" type="button" aria-label="Presentation Room Mode" data-tooltip="(Beta!) Create a room and invite other via a link to your presentation">
                        <i className="record large icon"></i>
                    </button>
                </div>
                <div className="ui basic segment" style={panelDIVStyles}>
                  <div ref="presentationList">
                      {(this.props.ActivityFeedStore.presentations.length < 1)
                      ?
                      <div>There are currently no live presentations for this deck.</div>
                      :
                      <ReactList ref="infiniteList" className="ui list"
                          itemRenderer={this.renderItem.bind(this)}
                          length={this.props.ActivityFeedStore.presentations.length}
                          type={'simple'}>
                      </ReactList>
                    }
                  </div>
                </div>
            </div>
        );
    }
}

PresentationsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
PresentationsPanel = connectToStores(PresentationsPanel, [ActivityFeedStore], (context, props) => {
    return {
        ActivityFeedStore: context.getStore(ActivityFeedStore).getState()
    };
});
export default PresentationsPanel;
