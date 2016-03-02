import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';
import SingleNode from './SingleNode';
import MultiNode from './MultiNode';

class Tree extends React.Component {
    handleUpKey(){
        let prevPath = TreeUtil.prevNodePath(this.props.selector, this.props.flatTree);
        if(prevPath){
            this.context.executeAction(navigateAction, {
                url: prevPath
            });
        }
        //returning false stops the event and prevents default browser events
        return false;
    }
    handleDownKey(e){
        console.log(e);
        let nextPath = TreeUtil.nextNodePath(this.props.selector, this.props.flatTree);
        if(nextPath){
            this.context.executeAction(navigateAction, {
                url: nextPath
            });
        }
        //returning false stops the event and prevents default browser events
        return false;
    }
    handleRightKey(){
        console.log('right key from tree');
        return false;
    }
    componentDidMount() {
        key('up', 'tree', this.handleUpKey.bind(this));
        key('down', 'tree', this.handleDownKey.bind(this));
        key('right', 'tree', this.handleRightKey);
    }
    componentWillUnmount() {
        key.unbind('up', 'tree');
        key.unbind('down', 'tree');
        key.unbind('right', 'tree');
    }
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
            <div className="ui celled list" ref="tree" >
                {output}
            </div>
        );
    }
}
Tree.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default Tree;
