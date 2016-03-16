import React from 'react';
import ActivityItem from './ActivityItem';
import ReactList from 'react-list';
import loadMoreActivities from '../../../actions/activityfeed/loadMoreActivities';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import {connectToStores} from 'fluxible-addons-react';

class ActivityList extends React.Component {
    renderItem(index, key) {
        const activities = this.props.ActivityFeedStore.activities;
        if (index + 3 > activities.length && index < 200) {
            const payload = {
                params: this.props.ActivityFeedStore.selector,
                newActivities: { latestId: activities[activities.length-1].id, numNew: 30 }
            };
            //Todo: please fix the bug: only fecth service on scroll
            //this.context.executeAction(loadMoreActivities, payload);
        }
        const node = activities[index];
        return (
            <div className="ui item" key={key} style={{ margin: '1em 0'}}>
                <ActivityItem activity={node} />
            </div>
        );
    }
    render() {
        let rows = [];
        let currentRow = [];
        this.props.ActivityFeedStore.activities.forEach((item) => {
            if (currentRow.length % 3 === 0 && currentRow.length > 0) {
                rows.push((
                    <div className="row" key={rows.length}>
                        {currentRow}
                    </div>
                ));
                currentRow = [];
            }
            currentRow.push((
                <div className="ui column" key={currentRow.length}>
                    <ActivityItem activity={item} />
                </div>
            ));
        });
        if (currentRow.length > 0) {
            rows.push((
                <div className="row" key={rows.length}>
                    {currentRow}
                </div>
            ));
        }
        let list = this.props.ActivityFeedStore.activities.map((node, index) => {
            return (
                <div className="ui item" key={index} style={{ margin: '1em 0'}}>
                    <ActivityItem activity={node} />
                </div>
            );
        });
        const listStyles = {
            maxHeight: '400px',
            overflowY: 'auto'
        };
        return (
            <div ref="activityList" style={listStyles}>
                <ReactList className="ui list"
                    itemRenderer={this.renderItem.bind(this)}
                    length={this.props.ActivityFeedStore.activities.length}
                    type={'variable'}>
                </ReactList>
            </div>
        );
    }
}

ActivityList.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ActivityList = connectToStores(ActivityList, [ActivityFeedStore], (context, props) => {
    return {
        ActivityFeedStore: context.getStore(ActivityFeedStore).getState()
    };
});

export default ActivityList;
