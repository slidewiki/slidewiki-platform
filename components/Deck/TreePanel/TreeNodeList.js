import React from 'react';
import TreeNode from './TreeNode';
import TreeNodeTarget from './TreeNodeTarget';
import classNames from 'classnames/bind';

class TreeNodeList extends React.Component {

    render() {
        let self = this;
        let childNodes = '';
        let childNodesClass = '';

        if (this.props.parentNode.get('type') === 'deck' && this.props.parentNode.get('children')) {
            childNodes = this.props.parentNode.get('children').map((node, index) => {
                return (
                    <div key={index} style={{position: 'relative'}}>
                        {index === 0 ? <TreeNodeTarget parentNode={self.props.parentNode} nodeIndex={index}
                                                       onMoveNode={self.props.onMoveNode} isAfterNode={false}/> : null }
                        <TreeNode onToggleNode={self.props.onToggleNode}
                                  onSwitchOnAction={self.props.onSwitchOnAction}
                                  onRename={self.props.onRename} onUndoRename={self.props.onUndoRename}
                                  onSave={self.props.onSave} onAddNode={self.props.onAddNode}
                                  onDeleteNode={self.props.onDeleteNode} onMoveNode={self.props.onMoveNode}
                                  item={node} parentNode={self.props.parentNode} nodeIndex={index}
                                  rootNode={self.props.rootNode}
                                  page={self.props.page} mode={self.props.mode}
                                  username={self.props.username}/>
                        <TreeNodeTarget parentNode={self.props.parentNode} nodeIndex={index + 1}
                                        onMoveNode={self.props.onMoveNode} isAfterNode={true}/>
                    </div>
                );
            });
            //show/hide sub nodes based on the expanded state
            childNodesClass = classNames({
                'list': true,
                'hide-element': !self.props.parentNode.get('expanded')
            });
        }
        return (<div className={childNodesClass}> {childNodes} </div>);
    }
}

TreeNodeList.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};


export default TreeNodeList;
