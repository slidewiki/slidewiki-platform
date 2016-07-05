import React from 'react';
import ReactDom from 'react-dom';
import { Microservices } from '../../../configs/microservices';

class CategoryBox extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
          <div>
            <div className="ui segments">
              <div className="ui segment">
                <p>Navigation</p>
              </div>
              <div className="ui secondary segment">
                <p><i className="icon folder"></i> My Decks</p>
              </div>
              <div className="ui secondary segment">
                <p><i className="icon setting"></i> Settings</p>
              </div>
              <div className="ui secondary segment">
                <p><i className="icon bar chart"></i> My Stats</p>
              </div>
            </div>
          </div>
        );
    }
}

CategoryBox.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default CategoryBox;
