import React from 'react';
import {NavLink} from 'fluxible-router';
import SingleTreeNode from './SingleTreeNode';

class MultiTreeNode extends React.Component {
    render() {
        let output = this.props.item.children.map((node, index) => {
            if(node.type === 'deck'){
                return (
                    <MultiTreeNode item={node} rootNode={this.props.rootNode} key={index} />
                );
            }else{
                return (
                    <SingleTreeNode item={node} rootNode={this.props.rootNode} key={index} />
                );
            }
        });
        return (
            <div className="item">
                <NavLink href={'/deck/' + this.props.rootNode.id + '/deck/' + this.props.item.id}>{this.props.item.title}</NavLink>
                 <div className="list">
                     {output}
                 </div>
            </div>
        );
    }
}

export default MultiTreeNode;
