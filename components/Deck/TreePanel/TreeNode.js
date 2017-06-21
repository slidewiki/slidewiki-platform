import React from 'react';
import Immutable from 'immutable';
import classNames from 'classnames/bind';
import {NavLink} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';
import {DragSource, DropTarget} from 'react-dnd';
import TreeNodeList from './TreeNodeList';
import TreeNodeTarget from './TreeNodeTarget';
import cheerio from 'cheerio';
import AttachSubdeck from '../ContentPanel/AttachSubdeck/AttachSubdeckModal';
import AttachSlides from '../ContentPanel/AttachSubdeck/AttachSlidesModal';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../stores/ContentStore';


const findAllDescendants = (node) => Immutable.Set.of(node).union(node.get('children') ? node.get('children').flatMap(findAllDescendants) : Immutable.List());

const treeNodeSource = {
    beginDrag(props) {
        return {
            item: props.item,
            parentNode: props.parentNode,
            nodeIndex: props.nodeIndex,
            allDescendants: findAllDescendants(props.item)
        };
    },
    canDrag(props, monitor){
        return props.parentNode.get('children').size > 1;
    }
};

class TreeNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mouseover: 0};
    }

    //do not re-render in case of same props wihtout selector and if mode has not changed
    shouldComponentUpdate(nextProps, nextState) {
        return !(Immutable.is(nextProps.item, this.props.item) && nextProps === this.props.mode);
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    handleExpandIconClick(selector, e) {
        this.props.onToggleNode(selector);
        e.stopPropagation();
    }

    handleAddClick(selector, nodeSpec, e) {
        this.props.onAddNode(selector, nodeSpec);
        e.stopPropagation();
    }

    handleMouseOver(e) {
        this.setState({mouseover: 1});
        e.stopPropagation();
    }

    handleMouseOut(e) {
        this.setState({mouseover: 0});
        e.stopPropagation();
    }

    handleDeleteClick(selector, e) {
        this.props.onDeleteNode(selector);
        e.stopPropagation();
    }

    handleRenameClick(selector, e) {
        //only if user is logged in and has the rights
        if (this.props.username !== '' && this.props.permissions.edit && !this.props.permissions.readOnly) {
            this.props.onRename(selector);
            e.stopPropagation();
        }
    }

    handleUndoRenameClick(selector, e) {
        this.props.onDoRename(selector);
        e.stopPropagation();
    }

    handleMenuClick(selector, e) {
        this.props.onSwitchOnAction(selector);
        e.stopPropagation();
    }

    handleEditFocus(e) {
        //select all content
        e.target.select();
    }

    handleNameChange(e) {
        //console.log(e.target.value);
    }

    handleKeyDown(selector, e) {
        switch (e.keyCode) {
            //case 9: // Tab
            case 13: // Enter
                if (e.target.value.trim()) {
                    this.props.onSave(selector, this.props.item.get('title'), e.target.value.trim());
                }
                break;
            case 27: // escape
                this.props.onUndoRename(selector);
                break;
        }
    }

    render() {
        let self = this;
        const {isDragging, connectDragSource, nodeIndex} = this.props;
        //adapt URLs based on the current page
        let nodeSelector = {
            id: this.props.rootNode.id,
            stype: this.props.item.get('type'),
            sid: this.props.item.get('id'),
            spath: this.props.item.get('path')
        };
        let nodeURL = TreeUtil.makeNodeURL(nodeSelector, this.props.page, this.props.mode);
        let childNodesDIV = '';
        let actionSigClass;
        let actionBtnsClass;
        if (this.props.item.get('type') === 'deck') {
            childNodesDIV = <TreeNodeList parentNode={self.props.item} onToggleNode={self.props.onToggleNode}
                                          onSwitchOnAction={self.props.onSwitchOnAction} onRename={self.props.onRename}
                                          onUndoRename={self.props.onUndoRename} onSave={self.props.onSave}
                                          onAddNode={self.props.onAddNode} onDeleteNode={self.props.onDeleteNode}
                                          onMoveNode={self.props.onMoveNode} mode={self.props.mode}
                                          page={self.props.page} rootNode={self.props.rootNode}
                                          username={self.props.username} permissions={self.props.permissions}/>;
        }
        actionSigClass = classNames({
            'hide-element': !this.props.item.get('selected') && !this.state.mouseover
        });
        let actionSignifier = <span className={actionSigClass}
                                    onClick={this.handleMenuClick.bind(this, nodeSelector)}><i
            className="ui link ellipsis horizontal icon right floated"></i></span>;
        actionBtnsClass = classNames({
            'hide-element': !this.props.item.get('onAction'),
            'ui right aligned': true
        });
        const buttonItemClass = classNames({
            'ui basic icon button': true,
            'disabled': this.props.permissions.readOnly || !this.props.permissions.edit || this.props.ContentStore.mode === 'edit'
        });

        const duplicateItemClass = classNames({
            'ui basic icon button': true,
            'disabled': this.props.item.get('type') === 'deck'|| this.props.permissions.readOnly || !this.props.permissions.edit || this.props.ContentStore.mode=== 'edit'
        });
        let buttonStyle = {
            classNames : classNames({
                'ui':true,
                'disabled': this.props.permissions.readOnly || !this.props.permissions.edit || this.props.ContentStore.mode === 'edit'
            }),
            iconSize : 'small',
            attached : '',
            noTabIndex : this.props.ContentStore.mode ==='edit'

        };
        let actionBtns = (
            <div className={actionBtnsClass}>
                <div className="ui small basic icon compact fluid buttons">
                    <button className={buttonItemClass}
                            onClick={this.handleAddClick.bind(this, nodeSelector, {type: 'slide', id: '0'})}
                            aria-label="Add Slide"
                            data-tooltip="Add Slide"
                            tabIndex={this.props.ContentStore.mode ==='edit'?-1:0}>
                        <i className="icons">
                            <i className="file text icon"></i>
                            <i className="inverted corner plus icon"></i>
                        </i>
                    </button>
                    <AttachSlides buttonStyle={buttonStyle} selector={nodeSelector} />
                    <button className={buttonItemClass}
                            onClick={this.handleAddClick.bind(this, nodeSelector, {type: 'deck', id: '0'})}
                            aria-label="Add deck"
                            data-tooltip="Add deck"
                            tabIndex={this.props.ContentStore.mode ==='edit'?-1:0}>
                        <i className="medium icons">
                            <i className="yellow folder icon"></i>
                            <i className="inverted corner plus icon"></i>
                        </i>
                    </button>
                    <AttachSubdeck buttonStyle={buttonStyle} selector={nodeSelector}/>
                    <button className={duplicateItemClass} title="Duplicate"
                            onClick={this.handleAddClick.bind(this, nodeSelector, {
                                type: this.props.item.get('type'),
                                id: this.props.item.get('id')
                            })}
                            aria-label="Duplicate"
                            data-tooltip="Duplicate"
                            tabIndex={this.props.ContentStore.mode ==='edit'?-1:0}>
                        <i className="copy icon"></i>
                    </button>
                    <button className={buttonItemClass} onClick={this.handleDeleteClick.bind(this, nodeSelector)}
                          aria-label="Delete"
                          data-tooltip="Delete"
                          tabIndex={this.props.ContentStore.mode ==='edit'?-1:0}>
                        <i className="red trash circle icon"></i>
                    </button>
                    {/*
                     <button className="ui disabled button" aria-label="Settings" data-tooltip="Settings">
                     <i className="black setting icon"></i>
                     </button>
                     */}
                </div>
            </div>
        );
        //change the node title style if it is selected
        const nodeTitle = cheerio.load(this.props.item.get('title')).text();
        let nodeTitleDIV = nodeTitle;
        if (this.props.item.get('selected')) {
            nodeTitleDIV = <strong> {nodeTitle} </strong>;
        }
        let nodeDIV = '';
        if (this.props.item.get('editable')) {
            nodeDIV = <input autoFocus onFocus={this.handleEditFocus} type="text" defaultValue={nodeTitle}
                             onChange={this.handleNameChange} onKeyDown={this.handleKeyDown.bind(this, nodeSelector)}/>;
            actionSignifier = '';
        } else {
            nodeDIV = <NavLink href={nodeURL} onDoubleClick={this.handleRenameClick.bind(this, nodeSelector)} >
                {nodeTitleDIV}</NavLink>;
        }
        //change the node icon based on the type of node and its expanded state
        let iconClass = classNames({
            'ui icon': true,
            'grey file text': (this.props.item.get('type') === 'slide'),
            'yellow folder link': (this.props.item.get('type') === 'deck'),
            'open': this.props.item.get('expanded')
        });
        //hide focused outline
        let compStyle = {
            outline: 'none',
            opacity: isDragging ? '0.4' : '1',
            position: 'relative'
        };

        return connectDragSource(
            <div className="item" style={compStyle}>
                {nodeIndex === 0 ? <TreeNodeTarget parentNode={self.props.parentNode} nodeIndex={nodeIndex}
                                               onMoveNode={self.props.onMoveNode} isAfterNode={false}/> : null }
                <div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}>
                    <i onClick={this.handleExpandIconClick.bind(this, nodeSelector)} className={iconClass}>  </i>
                    {nodeDIV}
                    {(this.props.username === '' || !this.props.permissions.edit || this.props.permissions.readOnly) ? '' : actionSignifier}
                </div>
                {actionBtns}
                {childNodesDIV}
                <TreeNodeTarget parentNode={self.props.parentNode} onMoveNode={self.props.onMoveNode}
                                nodeIndex={nodeIndex + 1} isAfterNode={true}/>
            </div>
        );
    }
}

TreeNode = connectToStores(TreeNode,[ContentStore], (context, props) => {
    return {
        ContentStore: context.getStore(ContentStore).getState()
    };
});

let TreeNodeWrapped = DragSource('tree-node', treeNodeSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
}))(TreeNode);

export default TreeNodeWrapped;
