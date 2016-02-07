import React from 'react';

class Breadcrumb extends React.Component {
    render() {
        return (
            <div className="sw-breadcrumb" ref="breadcrumb">
                <div className="ui large breadcrumb">
                  <a className="section">Semantic Web</a>
                  <i className="right chevron icon divider"></i>
                  <a className="section">RDF</a>
                  <i className="right chevron icon divider"></i>
                  <div className="active section">Introduction</div>
                </div>

             </div>
        );
    }
}

export default Breadcrumb;
