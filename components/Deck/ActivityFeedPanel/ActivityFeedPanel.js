import React from 'react';

class ActivityFeedPanel extends React.Component {
    render() {
        return (
            <div className="sw-contributors-panel" ref="activityFeedPanel">

                <div className="ui segments">
                    <div className="ui secondary segment">
                        <a href="/activities/deck/57">Latest Activities on the Selected Content</a>
                    </div>
                    <div className="ui olive segment">
                        <div className="ui feed">
                            <div className="event">
                                <div className="label">
                                    <i className="ui user icon"></i>
                                </div>
                                <div className="content">
                                  <div className="summary">
                                    <a className="user">
                                      Ali K.
                                    </a> added a new slide.
                                    <div className="date">
                                      1 Hour Ago
                                    </div>
                                  </div>
                                  <div className="meta">
                                    <a className="like">
                                      <i className="like icon"></i> 4 Likes
                                    </a>
                                  </div>
                                </div>
                            </div>
                            <div className="event">
                                <div className="label">
                                    <i className="pencil icon"></i>
                                </div>
                                <div className="content">
                                    <div className="summary">
                                        Slide #123 was edited by <a>Darya T.</a>.
                                        <div className="date">Today</div>
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default ActivityFeedPanel;
