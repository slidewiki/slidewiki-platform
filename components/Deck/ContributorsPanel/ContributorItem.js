import React from 'react';

class ContributorItem extends React.Component {
    render() {
        return (
            <div className="item">
                <i className="large github middle aligned icon"></i>
                <div className="content">
                  <a className="header" href={'/user/' + this.props.data.id}>{this.props.data.username}</a>
                  <div className="description">{this.props.data.organization}</div>
                </div>
            </div>
        );
    }
}

export default ContributorItem;
