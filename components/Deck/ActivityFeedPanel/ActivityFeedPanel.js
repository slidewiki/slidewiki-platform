import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import loadActivities from '../../../actions/activityfeed/loadActivities';
import ActivityFeedStore from '../../../stores/ActivityFeedStore';
import ActivityList from './ActivityList';

class ActivityFeedPanel extends React.Component {
    componentWillMount() {
        let selector = this.props.ActivityFeedStore.selector;
        if (selector !== undefined) {
            if (this.isLocalStorageOn()) {
                console.log('localstorage', localStorage.getItem('activitiesCount'));

                if (String(localStorage.getItem('activitiesCount')) !== String(this.props.ActivityFeedStore.activities.length)) {
                    console.log('not equal', localStorage.getItem('activitiesCount'), );// wrong data read from browser cache
                    let date = new Date().getTime();
                    this.context.executeAction(loadActivities, {params: {date: date, id: selector.id, spath: selector.spath, stype: selector.stype, sid: selector.sid, smode: selector.smode}});
                }
            }
        }
    }

    isLocalStorageOn () {
        let mod = 'react-count';
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    }

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
