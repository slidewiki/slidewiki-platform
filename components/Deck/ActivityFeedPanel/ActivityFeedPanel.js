import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import ActivityList from './ActivityList';

class ActivityFeedPanel extends React.Component {
    render() {
        return (
            <div ref="activityFeedPanel">
                <div className="ui segments">
                    <div className="ui secondary segment">
                        <a href="/activities/deck/57">Latest Activities on the Selected Content</a>
                    </div>
                    <div className="ui olive segment">
                        <ActivityList  items={this.props.ActivityFeedStore.activities} />
                    </div>
                </div>
            </div>
        );
    }
}

ActivityFeedPanel = connectToStores(ActivityFeedPanel, [ActivityFeedStore], (context, props) => {
    return {
        ActivityFeedStore: context.getStore(ActivityFeedStore).getState()
    };
});
export default ActivityFeedPanel;
