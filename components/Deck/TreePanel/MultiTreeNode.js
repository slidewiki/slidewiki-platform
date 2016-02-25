import React from 'react';
import {NavLink} from 'fluxible-router';
import SingleTreeNode from './SingleTreeNode';

class MultiTreeNode extends React.Component {
    render() {
        let self = this;
        let output = this.props.item.children.map((node, index) => {
            if(node.type === 'deck'){
                return (
                    <MultiTreeNode item={node} selector={self.props.selector} rootNode={self.props.rootNode} key={index} nodePath={self.props.nodePath.concat([[node.id, index+1]])} nodePosition={index+1} />
                );
            }else{
                return (
                    <SingleTreeNode item={node} selector={self.props.selector} rootNode={self.props.rootNode} key={index} nodePath={self.props.nodePath.concat([[node.id, index+1]])} nodePosition={index+1} />
                );
            }
        });
        return (
            <div className="item">
                <SingleTreeNode item={self.props.item} selector={self.props.selector} rootNode={self.props.rootNode} nodePath={self.props.nodePath} nodePosition={self.props.nodePosition} />
                 <div className="list">
                     {output}
                 </div>
            </div>
        );
    }
}

export default MultiTreeNode;
