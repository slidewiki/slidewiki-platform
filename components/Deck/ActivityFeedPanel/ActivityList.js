import React from 'react';
import ActivityItem from './ActivityItem';
import ReactList from 'react-list';
import _ from 'lodash';

function timeFromNow(now, hours, mins) {
    return now - 60000*mins - 3600000*hours;
}

class ActivityList extends React.Component {
    state = {
        items: []
    };
    componentWillMount() {
        this.setState({
            items: this.props.items.concat(this.generateRandomActivities(20, this.props.items.length))
        });
    }
    getRandomActivity() {
        return _.merge({}, this.props.items[Math.floor(Math.random()*1000) % 11]);
    }
    generateRandomActivities(numActivities, startID) {
        const now = Date.now();
        let activities = [];
        for (let i=0; i<numActivities; i++) {
            let a = this.getRandomActivity();
            a.id = i+startID;
            a.date = timeFromNow(now, 0, 1);
            a.contentName = a.contentName + ' (random)';
            activities.push(a);
        }
        return activities;
    }
    renderItem(index, key) {
        let that = this;
        if (index + 3 > this.state.items.length && index < 200) {
            setTimeout(() => {
                that.setState({
                    items: that.state.items.concat(that.generateRandomActivities(30, that.state.length))
                });
            });
        }
        const node = this.state.items[index];
        return (
            <div className="ui item" key={key} style={{ margin: '1em 0'}}>
                <ActivityItem activity={node} />
            </div>
        );
    }
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
                    length={this.state.items.length}
                    type={'variable'}>
                </ReactList>
            </div>
        );
    }
}

export default ActivityList;
