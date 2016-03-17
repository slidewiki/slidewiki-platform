import React from 'react';
import {HotKeys} from 'react-hotkeys';
import {NavLink, navigateAction} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';
import TreeNode from './TreeNode';

class Tree extends React.Component {
    getKeyMap() {
        const keyMap = {
            'moveUp': 'up',
            'moveDown': 'down'
        };
        return keyMap;
    }
    getKeyMapHandlers() {
        const handlers = {
            'moveUp': (event) => this.handleUpKey(this.props.prevSelector, this.props.page, this.props.mode),
            'moveDown': (event) => this.handleDownKey(this.props.nextSelector, this.props.page, this.props.mode)
        };
        return handlers;
    }
    handleUpKey(prevSelector, page, mode){
        let selector = {id: prevSelector.get('id'), stype: prevSelector.get('stype'), sid: prevSelector.get('sid'), spath: prevSelector.get('spath')};
        let prevPath = TreeUtil.makeNodeURL(selector, page, mode);
        if(prevPath){
            this.context.executeAction(navigateAction, {
                url: prevPath
            });
        }
        //returning false stops the event and prevents default browser events
        return false;
    }
    handleDownKey(nextSelector, page, mode){
        let selector = {id: nextSelector.get('id'), stype: nextSelector.get('stype'), sid: nextSelector.get('sid'), spath: nextSelector.get('spath')};
        let nextPath = TreeUtil.makeNodeURL(selector, page, mode);
        if(nextPath){
            this.context.executeAction(navigateAction, {
                url: nextPath
            });
        }
        //returning false stops the event and prevents default browser events
        return false;
    }
    render() {
        let self = this;
        //for simplicity and flexibility we divide tree nodes into single and multi
        let output = this.props.items.map((node, index) => {
            return (
                <TreeNode onToggleNode={self.props.onToggleNode} onRename={self.props.onRename} onSave={self.props.onSave} onAddNode={self.props.onAddNode} onDeleteNode={self.props.onDeleteNode} item={node} mode={self.props.mode} page={self.props.page} rootNode={self.props.rootNode} key={index} />
            );
        });
        return (
            <HotKeys keyMap={this.getKeyMap()} handlers={this.getKeyMapHandlers()}>
                <div className="ui celled list" ref="tree">
                    {output}
                </div>
            </HotKeys>
        );
    }
}
Tree.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default Tree;
