import React from 'react';
import {HotKeys} from 'react-hotkeys';
import {NavLink, navigateAction} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';
import TreeNode from './TreeNode';

class Tree extends React.Component {
    getKeyMap() {
        const keyMap = {
            'moveUp': 'up',
            'moveDown': 'down',
            'fastForward': 'shift+up',
            'fastBackward': 'shift+down',
            'expandOrMenu': 'right',
            'collapseOrMenu': 'left'
        };
        return keyMap;
    }
    getKeyMapHandlers() {
        const handlers = {
            'moveUp': (event) => this.handleUpKey(this.props.prevSelector, this.props.page, this.props.mode),
            'moveDown': (event) => this.handleDownKey(this.props.nextSelector, this.props.page, this.props.mode),
            'fastForward': (event) => this.handleForwardClick(),
            'fastBackward': (event) => this.handleBackwardClick(),
            'expandOrMenu': (event) => this.handleRightKey(),
            'collapseOrMenu': (event) => this.handleLeftKey()
        };
        return handlers;
    }
    handleRightKey() {
        let node = TreeUtil.getImmNodeFromPath(this.props.deckTree, this.props.selector.get('spath'));
        if(node.get('editable')){
            //disable handler when editing node
            return true;
        }else{
            if(node.get('type') === 'deck'){
                if(!node.get('expanded')){
                    this.props.onToggleNode({id: this.props.rootNode.id, stype: this.props.selector.get('stype'), sid: this.props.selector.get('sid'), spath: this.props.selector.get('spath')});
                }else{
                    this.props.onSwitchOnAction({id: this.props.rootNode.id, stype: this.props.selector.get('stype'), sid: this.props.selector.get('sid'), spath: this.props.selector.get('spath')});
                }
            }else{
                this.props.onSwitchOnAction({id: this.props.rootNode.id, stype: this.props.selector.get('stype'), sid: this.props.selector.get('sid'), spath: this.props.selector.get('spath')});
            }
            return false;
        }
    }
    handleLeftKey(){
        let node = TreeUtil.getImmNodeFromPath(this.props.deckTree, this.props.selector.get('spath'));
        if(node.get('editable')){
            //disable handler when editing node
            return true;
        }else{
            if(node.get('type') === 'deck'){
                if(node.get('onAction')){
                    this.props.onSwitchOnAction({id: this.props.rootNode.id, stype: this.props.selector.get('stype'), sid: this.props.selector.get('sid'), spath: this.props.selector.get('spath')});
                }else{
                    if(node.get('expanded')){
                        this.props.onToggleNode({id: this.props.rootNode.id, stype: this.props.selector.get('stype'), sid: this.props.selector.get('sid'), spath: this.props.selector.get('spath')});
                    }
                }
            }else{
                if(node.get('onAction')){
                    this.props.onSwitchOnAction({id: this.props.rootNode.id, stype: this.props.selector.get('stype'), sid: this.props.selector.get('sid'), spath: this.props.selector.get('spath')});
                }
            }
            return false;
        }
    }
    handleForwardClick(){
        let firstNode =  this.props.deckTree.get('children').get(0);
        let selector = {id: this.props.rootNode.id, stype: firstNode.get('type'), sid: firstNode.get('id'), spath: firstNode.get('path')};
        let path = TreeUtil.makeNodeURL(selector, this.props.page, this.props.mode);
        if(path){
            this.context.executeAction(navigateAction, {
                url: path
            });
        }
        //returning false stops the event and prevents default browser events
        return false;
    }
    handleBackwardClick(){
        let lastNode =  this.props.deckTree.get('children').get(this.props.deckTree.get('children').size - 1);
        let selector = {id: this.props.rootNode.id, stype: lastNode.get('type'), sid: lastNode.get('id'), spath: lastNode.get('path')};
        let path = TreeUtil.makeNodeURL(selector, this.props.page, this.props.mode);
        if(path){
            this.context.executeAction(navigateAction, {
                url: path
            });
        }
        //returning false stops the event and prevents default browser events
        return false;
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
        //hide focused outline
        let compStyle = {
            outline: 'none'
        };
        let self = this;
        let output = '';
        if(this.props.items && this.props.items.size){
            output = this.props.items.map((node, index) => {
                return (
                    <TreeNode onToggleNode={self.props.onToggleNode} onSwitchOnAction={self.props.onSwitchOnAction} onRename={self.props.onRename} onUndoRename={self.props.onUndoRename} onSave={self.props.onSave} onAddNode={self.props.onAddNode} onDeleteNode={self.props.onDeleteNode} item={node} mode={self.props.mode} page={self.props.page} rootNode={self.props.rootNode} key={index} />
                );
            });
        }
        return (
            <HotKeys keyMap={this.getKeyMap()} handlers={this.getKeyMapHandlers()} className="sw-tree" style={compStyle}>
                <div className="ui divided list" ref="tree">
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
