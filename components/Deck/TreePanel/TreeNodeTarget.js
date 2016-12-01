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
        let compStyle = {
            boxSizing: 'border-box',
            width: '100%',
            height: '1em',
            position: 'absolute',
            zIndex: 1,
            display: this.props.canDrop ? 'flex' : 'none',
        };

        let dropMarker = {
            boxSizing: 'border-box',
            width: '100%',
            height: '1px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, light-gray, white)',
            alignSelf: 'center'
        };

        return connectDropTarget(
            <div style={Object.assign(compStyle, this.props.isAfterNode ? {bottom: '-0.6em'} : {top: '-0.6em'})}>
                <div style={ this.props.isDropping ? dropMarker : {} }/>
            </div>
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