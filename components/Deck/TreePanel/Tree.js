import React from 'react';
import {HotKeys} from 'react-hotkeys';
import {NavLink, navigateAction} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';
import TreeNodeList from './TreeNodeList';

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
            'moveUp': (event) => this.handleUpKey(),
            'moveDown': (event) => this.handleDownKey(),
            'fastForward': (event) => this.handleForwardClick(),
            'fastBackward': (event) => this.handleBackwardClick(),
            'expandOrMenu': (event) => this.handleRightKey(),
            'collapseOrMenu': (event) => this.handleLeftKey()
        };
        return handlers;
    }

    handleRightKey() {
        let node = TreeUtil.getImmNodeFromPath(this.props.deckTree, this.props.focusedSelector.get('spath'));
        if (node.get('editable') || this.props.username=== '') {
            //disable handler when editing node or when user is not loggedIn
            return true;
        } else {
            if (node.get('type') === 'deck') {
                if (!node.get('expanded')) {
                    this.props.onToggleNode({
                        id: this.props.rootNode.id,
                        stype: this.props.focusedSelector.get('stype'),
                        sid: this.props.focusedSelector.get('sid'),
                        spath: this.props.focusedSelector.get('spath')
                    });
                } else {
                    this.props.onSwitchOnAction({
                        id: this.props.rootNode.id,
                        stype: this.props.focusedSelector.get('stype'),
                        sid: this.props.focusedSelector.get('sid'),
                        spath: this.props.focusedSelector.get('spath')
                    });
                }
            } else {
                this.props.onSwitchOnAction({
                    id: this.props.rootNode.id,
                    stype: this.props.focusedSelector.get('stype'),
                    sid: this.props.focusedSelector.get('sid'),
                    spath: this.props.focusedSelector.get('spath')
                });
            }
            return false;
        }
    }

    handleLeftKey() {
        let node = TreeUtil.getImmNodeFromPath(this.props.deckTree, this.props.focusedSelector.get('spath'));
        if (node.get('editable')  || this.props.username=== '') {
            //disable handler when editing node or when user is not loggedIn
            return true;
        } else {
            if (node.get('type') === 'deck') {
                if (node.get('onAction')) {
                    this.props.onSwitchOnAction({
                        id: this.props.rootNode.id,
                        stype: this.props.focusedSelector.get('stype'),
                        sid: this.props.focusedSelector.get('sid'),
                        spath: this.props.focusedSelector.get('spath')
                    });
                } else {
                    if (node.get('expanded')) {
                        this.props.onToggleNode({
                            id: this.props.rootNode.id,
                            stype: this.props.focusedSelector.get('stype'),
                            sid: this.props.focusedSelector.get('sid'),
                            spath: this.props.focusedSelector.get('spath')
                        });
                    }
                }
            } else {
                if (node.get('onAction')) {
                    this.props.onSwitchOnAction({
                        id: this.props.rootNode.id,
                        stype: this.props.focusedSelector.get('stype'),
                        sid: this.props.focusedSelector.get('sid'),
                        spath: this.props.focusedSelector.get('spath')
                    });
                }
            }
            return false;
        }
    }

    handleForwardClick() {
        let firstNode = this.props.deckTree.get('children').get(0);
        let selector = {
            id: this.props.rootNode.id,
            stype: firstNode.get('type'),
            sid: firstNode.get('id'),
            spath: firstNode.get('path')
        };
        let path = TreeUtil.makeNodeURL(selector, this.props.page, this.props.mode);
        if (path) {
            this.context.executeAction(navigateAction, {
                url: path
            });
        }
        //returning false stops the event and prevents default browser events
        return false;
    }

    handleBackwardClick() {
        let lastNode = this.props.deckTree.get('children').get(this.props.deckTree.get('children').size - 1);
        let selector = {
            id: this.props.rootNode.id,
            stype: lastNode.get('type'),
            sid: lastNode.get('id'),
            spath: lastNode.get('path')
        };
        let path = TreeUtil.makeNodeURL(selector, this.props.page, this.props.mode);
        if (path) {
            this.context.executeAction(navigateAction, {
                url: path
            });
        }
        //returning false stops the event and prevents default browser events
        return false;
    }

    handleUpKey() {
        this.props.onFocusNode(this.props.prevSelector.toJS());
        //returning false stops the event and prevents default browser events
        return false;
    }

    handleDownKey() {
        this.props.onFocusNode(this.props.nextSelector.toJS());
        //returning false stops the event and prevents default browser events
        return false;
    }

    render() {
        //hide focused outline
        let compStyle = {
            outline: 'none'
        };
        let self = this;
        return (
            <HotKeys keyMap={this.getKeyMap()} handlers={this.getKeyMapHandlers()} className="sw-tree"
                     style={compStyle}>
                <div ref="tree">
                    <TreeNodeList parentNode={self.props.deckTree} onToggleNode={self.props.onToggleNode}
                                  onSwitchOnAction={self.props.onSwitchOnAction} onRename={self.props.onRename}
                                  onUndoRename={self.props.onUndoRename} onSave={self.props.onSave}
                                  onAddNode={self.props.onAddNode} onDeleteNode={self.props.onDeleteNode}
                                  onMoveNode={self.props.onMoveNode} mode={self.props.mode}
                                  page={self.props.page} rootNode={self.props.rootNode}
                                  username={self.props.username}
                                  permissions={self.props.permissions}/>
                </div>
            </HotKeys>
        );
    }
}
Tree.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default Tree;
