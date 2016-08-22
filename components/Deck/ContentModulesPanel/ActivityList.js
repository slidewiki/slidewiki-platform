import React from 'react';
import ActivityItem from './ActivityItem';
import ReactList from 'react-list';
import loadMoreActivities from '../../../actions/activityfeed/loadMoreActivities';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import {connectToStores} from 'fluxible-addons-react';

class ActivityList extends React.Component {
    renderItem(index, key) {
        return (
            <div className="ui item" key={key} style={{ margin: '1em 0'}}>
                <ActivityItem activity={this.props.ActivityFeedStore.activities[index]} />
            </div>
        );
    }
    onScroll() {
        const range = this.refs.infiniteList.getVisibleRange();
        const activities = this.props.ActivityFeedStore.activities;
        if (activities.length - range[1] < 5 && !this.loading && this.props.ActivityFeedStore.hasMore) {
            this.loading = true;
            const payload = {
                params: this.props.ActivityFeedStore.selector,
                newActivities: { start: activities.length, numNew: 30 }
                // newActivities: { latestId: activities[activities.length-1].id, numNew: 30 }
            };
            this.context.executeAction(loadMoreActivities, payload);
        }
    }
    componentDidMount() {
        this.loading = false;
        this.refs.activityList.addEventListener('scroll', this.onScroll.bind(this));
    }
    componentWillReceiveProps(nextProps) {
        // TODO: same as in the ActivityFeedStore; check if there is more elegant way to tell the component that action loadMoreActivities (in the onScroll function) was executed
        if (!nextProps.ActivityFeedStore.wasFetch) return;
        this.loading = false;
    }
    render() {
        ////////////////////////////////////////////////////////
        //legacy code (commented below), can be removed probably
        ////////////////////////////////////////////////////////

        //let rows = [];
        //let currentRow = [];
        //this.props.ActivityFeedStore.activities.forEach((item) => {
        //    if (currentRow.length % 3 === 0 && currentRow.length > 0) {
        //        rows.push((
        //            <div className="row" key={rows.length}>
        //                {currentRow}
        //            </div>
        //        ));
        //        currentRow = [];
        //    }
        //    currentRow.push((
        //        <div className="ui column" key={currentRow.length}>
        //            <ActivityItem activity={item} />
        //        </div>
        //    ));
        //});
        //if (currentRow.length > 0) {
        //    rows.push((
        //        <div className="row" key={rows.length}>
        //            {currentRow}
        //        </div>
        //    ));
        //}
        //let list = this.props.ActivityFeedStore.activities.map((node, index) => {
        //    return (
        //        <div className="ui item" key={index} style={{ margin: '1em 0'}}>
        //            <ActivityItem activity={node} />
        //        </div>
        //    );
        //});
        const listStyles = {
            maxHeight: '400px',
            overflowY: 'auto'
        };
        return (
            <div ref="activityList" style={listStyles}>
                <ReactList ref="infiniteList" className="ui list"
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
