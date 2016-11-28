import React from 'react';
import {DropTarget} from 'react-dnd';


const dropTarget = {
    canDrop(targetProps, monitor) {
        const sourceProps = monitor.getItem();
        return !(targetProps.parentNode === sourceProps.parentNode &&
            (targetProps.nodeIndex === sourceProps.nodeIndex || targetProps.nodeIndex === sourceProps.nodeIndex + 1)) && !(sourceProps.allDescendants.includes(targetProps.parentNode));
    },
    drop(targetProps, monitor, component) {
        const sourceProps = monitor.getItem();
        targetProps.onMoveNode(sourceProps.item, targetProps.parentNode, targetProps.nodeIndex);
    }
};

class TreeNodeTarget extends React.Component {
    render() {
        const {connectDropTarget} = this.props;
        return connectDropTarget(
            <div className="ui fitted divider"></div>
        );
    }
}

TreeNodeTarget.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DropTarget('tree-node', dropTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isDropping: monitor.isOver({shallow: true}) && monitor.canDrop(),
    canDrop: monitor.canDrop()
}))(TreeNodeTarget);