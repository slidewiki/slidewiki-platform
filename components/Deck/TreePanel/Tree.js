import React from 'react';
import Immutable from 'immutable';
import {NavLink, navigateAction} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';
import TreeNode from './TreeNode';

class Tree extends React.Component {
    handleUpKey(){
        let prevPath = TreeUtil.prevNodePath(this.props.selector, this.props.flatTree, this.props.page, this.props.mode);
        if(prevPath){
            this.context.executeAction(navigateAction, {
                url: prevPath
            });
        }
        //returning false stops the event and prevents default browser events
        return false;
    }
    handleDownKey(e){
        let nextPath = TreeUtil.nextNodePath(this.props.selector, this.props.flatTree, this.props.page, this.props.mode);
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
            return (
                <TreeNode onToggleNode={self.props.onToggleNode} onAddNode={self.props.onAddNode} onDeleteNode={self.props.onDeleteNode} item={node} mode={self.props.mode} page={self.props.page} rootNode={self.props.rootNode} key={index} />
            );
        });
        return (
            <div className="ui celled list" ref="tree">
                {output}
            </div>
        );
    }
}
Tree.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default Tree;
