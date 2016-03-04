import React from 'react';
import ActivityItem from './ActivityItem';

class ActivityList extends React.Component {
    render() {
        let rows = [];
        let currentRow = [];
        this.props.items.forEach((item) => {
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
        let list = this.props.items.map((node, index) => {
            return (
                <div className="ui item" key={index}>
                    <ActivityItem activity={node} />
                </div>
            );
        });
        const listStyles = {
            'max-height': '400px',
            'overflow-y': 'auto'
        };
        return (
            <div ref="activityList">
                <div className="ui list" style={listStyles}>
                    {list}
                </div>
             </div>
        );
    }
}

export default ActivityList;
