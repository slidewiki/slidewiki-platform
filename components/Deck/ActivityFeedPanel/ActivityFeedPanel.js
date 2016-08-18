import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import loadActivities from '../../../actions/activityfeed/loadActivities';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import ActivityList from './ActivityList';

class ActivityFeedPanel extends React.Component {

    render() {
        let pointingMenu = '';
        let activityDIV = '';
        const hrefPath = '/activities/' + this.props.ActivityFeedStore.selector.stype + '/' + this.props.ActivityFeedStore.selector.sid;

        activityDIV = <ActivityList />;

        return (
            <div ref="activityFeedPanel">
                <div className="ui compact segments">
                    <div className="ui secondary segment">
                        <a href={hrefPath}>Activity Feed</a>
                    </div>
                    <div className="ui segment attached">
                        {activityDIV}
                    </div>
                </div>
            </div>
        );
    }
}

ActivityFeedPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ActivityFeedPanel = connectToStores(ActivityFeedPanel, [ActivityFeedStore], (context, props) => {
    return {
        ActivityFeedStore: context.getStore(ActivityFeedStore).getState()
    };
});
export default ActivityFeedPanel;
