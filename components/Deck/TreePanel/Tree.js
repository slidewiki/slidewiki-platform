import React from 'react';
import {NavLink} from 'fluxible-router';
import SingleTreeNode from './SingleTreeNode';
import MultiTreeNode from './MultiTreeNode';

class Tree extends React.Component {
    render() {
        let output = this.props.items.map((node, index) => {
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
            <div className="ui celled ordered list" ref="tree">
                {output}
            </div>
        );
    }
}

export default Tree;
