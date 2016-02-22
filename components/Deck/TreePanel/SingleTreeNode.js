import React from 'react';
import {NavLink} from 'fluxible-router';

class SingleTreeNode extends React.Component {
    render() {
        return (
            <div className="item">
                <NavLink href={'/deck/' + this.props.rootNode.id + '/slide/' + this.props.item.id}>{this.props.item.title}</NavLink>
            </div>
        );
    }
}

export default SingleTreeNode;
