import React from 'react';
import {NavLink} from 'fluxible-router';

class Breadcrumb extends React.Component {
    render() {
        let self = this;
        let nodes = [];
        let list, output = '';
        if(this.props.selector.spath){
            nodes = this.props.selector.spath.split(';');
            list = nodes.map((node, index) => {
                if(index === (nodes.length - 1)){
                    return (
                        <div key={index} className="section">
                            {node}
                        </div>
                    );
                }else{
                    return (
                        <div key={index} className="section">
                            <NavLink href={'/deck/' + self.props.selector.id + '/deck/' + self.props.selector.sid + '/' + (nodes[index - 1] ? (nodes[index - 1] + ';') : '') + node}>{node}</NavLink>
                            <i className="right chevron icon divider"></i>
                        </div>
                    );
                }

            });
        }
        return (
            <div className="sw-breadcrumb" ref="breadcrumb">
                <div className="ui large breadcrumb">
                    <div className="section">
                        <NavLink href={'/deck/' + self.props.selector.id}> Semantic Web </NavLink>
                        <i className="right chevron icon divider"></i>
                    </div>
                    {list}
                </div>
             </div>
        );
    }
}

export default Breadcrumb;
