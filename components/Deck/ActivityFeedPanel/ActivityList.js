import React from 'react';
import ActivityItem from './ActivityItem';

class ActivityList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <div className="column" key={index}>
                    <ActivityItem activity={node} />
                </div>
            );
        });
        return (
            <div ref="activityList">
                <div className="ui three column doubling stackable internally celled grid">
                    {list}
                </div>
             </div>
        );
    }
}

export default ActivityList;
