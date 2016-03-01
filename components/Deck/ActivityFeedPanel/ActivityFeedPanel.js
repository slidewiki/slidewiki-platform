import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import loadActivities from '../../../actions/loadActivities';
import loadContentDiscussion from '../../../actions/loadContentDiscussion';
import loadContentHistory from '../../../actions/loadContentHistory';
import loadContentUsage from '../../../actions/loadContentUsage';
import ContentHistoryPanel from './ContentHistoryPanel/ContentHistoryPanel';
import ContentUsagePanel from './ContentUsagePanel/ContentUsagePanel';
import ContentDiscussionPanel from './ContentDiscussionPanel/ContentDiscussionPanel';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import ActivityList from './ActivityList';

class ActivityFeedPanel extends React.Component {
    handleTabClick(type, e) {
        switch (type) {
            case 'all':
                this.context.executeAction(loadActivities, {params: this.props.ActivityFeedStore.selector});
                break;
            case 'history':
                this.context.executeAction(loadContentHistory, {params: this.props.ActivityFeedStore.selector});
                break;
            case 'usage':
                this.context.executeAction(loadContentUsage, {params: this.props.ActivityFeedStore.selector});
                break;
            case 'discussion':
                this.context.executeAction(loadContentDiscussion, {params: this.props.ActivityFeedStore.selector});
                break;
            default:
        }
    }
    render() {
        let activityDIV ='';
        switch (this.props.ActivityFeedStore.activityType) {
            case 'all':
                activityDIV = <ActivityList  items={this.props.ActivityFeedStore.activities} />;
                break;
            case 'history':
                activityDIV = <ContentHistoryPanel />;
                break;
            case 'discussion':
                activityDIV = <ContentDiscussionPanel />;
                break;
            case 'usage':
                activityDIV = <ContentUsagePanel />;
                break;
            default:
                activityDIV = <ActivityList  items={this.props.ActivityFeedStore.activities} />;

        }
        let allTabClass = classNames({
            'item': true,
            'active': (this.props.ActivityFeedStore.activityType === 'all')
        });
        let historyTabClass = classNames({
            'item': true,
            'active': (this.props.ActivityFeedStore.activityType === 'history')
        });
        let usageTabClass = classNames({
            'item': true,
            'active': (this.props.ActivityFeedStore.activityType === 'usage')
        });
        let discussionTabClass = classNames({
            'item': true,
            'active': (this.props.ActivityFeedStore.activityType === 'discussion')
        });
        return (
            <div ref="activityFeedPanel">
                <div className="ui secondary pointing menu">
                    <a className="active item" href="/activities/deck/57">Activity Feed</a>
                    <a className="item"><i className="ui large thumbs outline up icon"></i> 12</a>
                    <a className="item"><i className="ui large share alternate icon"></i> 5</a>
                    <a className="item"><i className="ui large download icon"></i> 2</a>
                    <div className="right menu">
                      <div className="item">
                        <div className="ui icon input">
                            <input type="text" placeholder="Search in activity feed..." />
                            <i className="search link icon"></i>
                        </div>
                      </div>
                    </div>
                </div>
                <div className="ui olive segment top attached">
                    {activityDIV}
                </div>
                <div className="ui bottom attached tabular menu">
                    <a className={allTabClass} onClick={this.handleTabClick.bind(this, 'all')}>
                        All
                    </a>
                    <a className={discussionTabClass} onClick={this.handleTabClick.bind(this, 'discussion')}>
                        Comments
                    </a>
                    <a className={historyTabClass} onClick={this.handleTabClick.bind(this, 'history')}>
                        History
                    </a>
                    <a className={usageTabClass} onClick={this.handleTabClick.bind(this, 'usage')}>
                        Usage
                    </a>
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
