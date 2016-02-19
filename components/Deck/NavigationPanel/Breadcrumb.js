import React from 'react';
import {NavLink} from 'fluxible-router';

class Breadcrumb extends React.Component {
    render() {
        return (
            <div className="sw-breadcrumb" ref="breadcrumb">
                <div className="ui large breadcrumb">
                  <NavLink className="section" href="/deck/56">Semantic Web</NavLink>
                  <i className="right chevron icon divider"></i>
                  <NavLink className="section" href="/deck/56/deck/23">RDF</NavLink>
                  <i className="right chevron icon divider"></i>
                  <div className="active section">Introduction</div>
                </div>

             </div>
        );
    }
}

export default Breadcrumb;
