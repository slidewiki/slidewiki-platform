import React from 'react';

class ContributorsList extends React.Component {
    render() {
        return (
            <div className="sw-contributors-panel-list" ref="contributorsList">

                <div className="ui relaxed divided list">
                  <div className="item">
                    <i className="large github middle aligned icon"></i>
                    <div className="content">
                      <a className="header">ali1k</a>
                      <div className="description">VUA</div>
                    </div>
                  </div>
                  <div className="item">
                    <i className="large github middle aligned icon"></i>
                    <div className="content">
                      <a className="header">soeren</a>
                      <div className="description">Bonn</div>
                    </div>
                  </div>
                  <div className="item">
                    <i className="large github middle aligned icon"></i>
                    <div className="content">
                      <a className="header">darya</a>
                      <div className="description">VUA-Bonn</div>
                    </div>
                  </div>
                </div>

             </div>
        );
    }
}

export default ContributorsList;
