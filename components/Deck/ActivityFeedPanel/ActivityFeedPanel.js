import PropTypes from 'prop-types';
import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import loadActivities from '../../../actions/activityfeed/loadActivities';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import ActivityList from './ActivityList';
import {isLocalStorageOn} from '../../../common.js';

class ActivityFeedPanel extends React.Component {
    componentWillMount() {
        let selector = this.props.ActivityFeedStore.selector;
        //check localStorage to see if invalid data have been read from the browser cache
        if (selector !== undefined && isLocalStorageOn()) {
            const activitiesCountFromLocalStorage = localStorage.getItem('activitiesCount');
            if (activitiesCountFromLocalStorage !== undefined) {
                if (String(activitiesCountFromLocalStorage) !== String(this.props.ActivityFeedStore.activities.length)) {// wrong data read from browser cache
                    let date = new Date().getTime();
                    this.context.executeAction(loadActivities, {params: {date: date, id: selector.id, spath: selector.spath, stype: selector.stype, sid: selector.sid, smode: selector.smode}});
                }
                localStorage.removeItem('activitiesCount');// reset the state in localStorage
            }
        }
    }

    render() {
        let activityDIV = '';
        const panelDIVStyles = {
            maxHeight: 180,
            overflowY: 'auto'
        };

        activityDIV = <ActivityList />;

        return (
            <div ref="activityFeedPanel">
                <h4 className="ui header" >Activity Feed</h4>
                <div className="ui basic segment" style={panelDIVStyles}>
                    {activityDIV}
                </div>
            </div>
        );
    }
}

ActivityFeedPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
ActivityFeedPanel = connectToStores(ActivityFeedPanel, [ActivityFeedStore], (context, props) => {
    return {
        ActivityFeedStore: context.getStore(ActivityFeedStore).getState()
    };
});
export default ActivityFeedPanel;
