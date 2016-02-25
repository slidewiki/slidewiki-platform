import React from 'react';
import {NavLink} from 'fluxible-router';
import SingleTreeNode from './SingleTreeNode';
import MultiTreeNode from './MultiTreeNode';

class Tree extends React.Component {
    render() {
        let self = this;
        let output = this.props.items.map((node, index) => {
            if(node.type === 'deck'){
                return (
                    <MultiTreeNode item={node} selector={self.props.selector} rootNode={self.props.rootNode} key={index} nodePath={[[node.id, index+1]]} nodePosition={index+1} />
                );
            }else{
                return (
                    <SingleTreeNode item={node} selector={self.props.selector} rootNode={self.props.rootNode} key={index} nodePath={[[node.id, index+1]]} nodePosition={index+1} />
                );
            }
        });
        return (
            <div className="ui celled list" ref="tree">
                {output}
            </div>
        );
    }
}

export default Tree;
