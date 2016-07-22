import React from 'react';
import ReactDom from 'react-dom';

class DeckListItem extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
            <div className="item">
              <i className="large folder middle aligned icon"></i>
              <div className="content">
                <a className="header">{this.props.title}}</a>
                <div className="description">Updated {this.props.updated} mins ago</div>
              </div>
            </div>
        );
    }
}

DeckListItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeckListItem;
