import React from 'react';
import {NavLink} from 'fluxible-router';
import SingleNode from './SingleNode';
import MultiNode from './MultiNode';

class Tree extends React.Component {
    render() {
        let self = this;
        //for simplicity and flexibility we divide tree nodes into single and multi
        let output = this.props.items.map((node, index) => {
            if(node.type === 'deck'){
                return (
                    <MultiNode item={node} selector={self.props.selector} rootNode={self.props.rootNode} key={index} nodePath={[[node.id, index+1]]} nodePosition={index+1} />
                );
            }else{
                return (
                    <SingleNode item={node} selector={self.props.selector} rootNode={self.props.rootNode} key={index} nodePath={[[node.id, index+1]]} nodePosition={index+1} />
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
