import React from 'react';

class ContributorsList extends React.Component {
    render() {
        let list = this.props.items.map(function(node, index) {
            return (
                <div key={index} className="item">
                    <i className="large github middle aligned icon"></i>
                    <div className="content">
                      <a className="header" href={"/user/" + node.id}>{node.username}</a>
                      <div className="description">{node.organization}</div>
                    </div>
                </div>
            );
        });
        return (
            <div className="sw-contributors-panel-list" ref="contributorsList">

                <div className="ui relaxed divided list">
                    {list}
                </div>

             </div>
        );
    }
}

export default ContributorsList;
