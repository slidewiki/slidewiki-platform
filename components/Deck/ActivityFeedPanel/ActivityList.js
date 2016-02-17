import React from 'react';

class ActivityList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <div className="event" key={index}>
                    <div className="label">
                        <i className="ui user icon"></i>
                    </div>
                    <div className="content">
                      <div className="summary">
                        <a className="user" href={'/user/' + node.userID}>
                          {node.username}
                      </a> {node.type}ed {node.contentType} <a href={'/slidecontent/' + node.contentID}>#{node.contentID}</a>.
                        <div className="date">
                          {node.date}
                        </div>
                      </div>
                      <div className="meta">
                        <a className="like">
                          <i className="like icon"></i> {node.likesNo} Likes
                        </a>
                      </div>
                    </div>
                </div>
            );
        });
        return (
            <div ref="activityList">
                <div className="ui feed">
                    {list}
                </div>
             </div>
        );
    }
}

export default ActivityList;
