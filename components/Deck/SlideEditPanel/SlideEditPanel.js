import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import NavigationPanel from './../NavigationPanel/NavigationPanel';

class SlideEditPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isForkModalOpen: false,
            isTranslationModalOpen: false
        };
    }

    render() {

        return (
            <div className="ui container" ref="treePanel" role="navigation" onFocus={this.handleFocus} onBlur={this.handleBlur}>
                <NavigationPanel />
                <div className="four wide column">
                    <button className="ui small basic right floated icon button"><i className="edit icon"></i></button>
                </div>
                <div className="ui grey inverted segment bottom attached active tab">
                  <div className="ui center aligned grid">
                      <div className="ui vertical labeled icon grey inverted massive  menu">

                          <a className="item" role="button" tabIndex="0">

                              <i className="grid layout icon"></i>Template
                          </a>

                          <a className="item">
                              <i className="font icon"></i>Text
                          </a>

                          <a className="item">
                              <i className="photo icon"></i>Image
                          </a>
                          <a className="item">
                              <i className="film icon"></i>Video
                          </a>
                          <a className="item">
                              <i className="ellipsis horizontal icon"></i>Other
                          </a>
                          <a className="item">
                              <i className="plus square outline icon"></i>Embed
                          </a>
                          <div className="ui divider"></div>
                          <a className="item">
                              <i className="code icon"></i>HTML editor
                          </a>
                          <div className="ui divider"></div>
                          <a className="item">
                              <i className="linkify icon"></i>Sources
                          </a>
                      </div>
                  </div>
              </div>
            </div>
        );
    }
}

SlideEditPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default SlideEditPanel;
