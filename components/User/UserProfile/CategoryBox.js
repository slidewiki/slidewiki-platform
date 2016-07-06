import React from 'react';
import ReactDom from 'react-dom';
import { Microservices } from '../../../configs/microservices';

class CategoryBox extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
          <div className="ui vertical fluid buttons">
              <button className="ui button">
                <p><i className="icon folder"/> My Decks</p>
              </button>
              <button className="ui blue button">
                <p><i className="icon setting selected active"/> Settings</p>
              </button>
              <button className="ui button">
                <p><i className="icon bar chart"/> My Stats</p>
              </button>
          </div>
        );
    }
}

CategoryBox.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default CategoryBox;
