import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import classNames from 'classnames/bind';
import {NavLink} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';
import {DragSource} from 'react-dnd';
import TreeNodeList from './TreeNodeList';
import TreeNodeTarget from './TreeNodeTarget';
import cheerio from 'cheerio';
import AttachSubdeck from '../ContentPanel/AttachSubdeck/AttachSubdeckModal';
import AttachSlides from '../ContentPanel/AttachSubdeck/AttachSlidesModal';
import {connectToStores} from 'fluxible-addons-react';
import ContentStore from '../../../stores/ContentStore';
import {Button, Popup, Icon} from 'semantic-ui-react';


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

    // Explicitly focus the node link in view mode
    focusNode() {
        ReactDOM.findDOMNode(this.nodeLink).focus();
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps, prevState) {
        //check if node was focused
        if (this.props.item.get('focused') && !prevProps.item.get('focused')) {
            this.focusNode();
        }
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

    handleMenuKeyDown(selector, e) {
        // Enter is pressed while menu icon is focused
        if (e.keyCode == 13){
            this.props.onSwitchOnAction(selector);
            e.stopPropagation();
        }
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
        let canEdit = !this.props.permissions.readOnly && this.props.permissions.edit && this.props.ContentStore.mode !== 'edit';
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
        let actionSignifierStyle = {
            display: this.props.item.get('focused') || this.state.mouseover ? 'block' : 'none',
            'background-color': '#FFFFFF',
            height: '0.5em'
        };
        let actionSignifier = <Button as='button' icon ui size='mini' floated='right'
                                      onClick={this.handleMenuClick.bind(this, nodeSelector)}
                                      style={actionSignifierStyle}
                                      tabIndex={this.props.item.get('focused')}>
                <Icon name='ellipsis horizontal'/>
        </Button>;
        actionBtnsClass = classNames({
            'hide-element': !this.props.item.get('onAction'),
            'ui right aligned': true
        });

        let buttonStyle = {
            classNames : classNames({
                'ui':true,
                'disabled': !canEdit
            }),
            iconSize : 'small',
            attached : '',
            noTabIndex : !canEdit

        };
        let actionBtns = (
            <div className={actionBtnsClass}>
                <Button.Group basic size='small' fluid compact icon>
                    <Popup trigger={<Button as='button' basic icon
                                     disabled={!canEdit}
                                     onClick={this.handleAddClick.bind(this, nodeSelector, {type: 'slide', id: '0'})}
                                     aria-label="Add Slide"
                                     tabIndex={!canEdit ? -1 : 0}>
                        <Icon.Group>
                            <Icon name='file text'/>
                            <Icon corner inverted name='plus'/>
                        </Icon.Group>
                    </Button>}
                    content='Add Slide'
                    on='hover' />
                    <AttachSlides buttonStyle={buttonStyle} selector={nodeSelector} />
                    <Popup trigger={<Button as='button' basic icon
                                            disabled={!canEdit}
                                            onClick={this.handleAddClick.bind(this, nodeSelector, {type: 'deck', id: '0'})}
                                            aria-label="Add deck"
                                            tabIndex={!canEdit ? -1 : 0}>
                        <Icon.Group size='medium'>
                            <Icon color='yellow' name='folder'/>
                            <Icon corner inverted name='plus'/>
                        </Icon.Group>
                    </Button>} content='Add deck' on='hover'/>
                    <AttachSubdeck buttonStyle={buttonStyle} selector={nodeSelector}/>
                    <Popup trigger={<Button as='button' basic icon
                                            disabled={this.props.item.get('type') === 'deck' || !canEdit}
                                            onClick={this.handleAddClick.bind(this, nodeSelector, {
                                                type: this.props.item.get('type'),
                                                id: this.props.item.get('id')
                                            })}
                                            title="Duplicate"
                                            aria-label="Duplicate"
                                            tabIndex={this.props.item.get('type') === 'deck' || !canEdit ? -1 : 0}>
                        <Icon name='copy'/>
                    </Button>} content='Duplicate' on='hover'/>
                    <Popup trigger={<Button as='button' basic icon
                                            disabled={!canEdit}
                                            onClick={this.handleDeleteClick.bind(this, nodeSelector)}
                                            aria-label="Delete"
                                            tabIndex={!canEdit ? -1 : 0}>
                        <Icon color='red' name='trash'/>
                    </Button>} content='Delete' on='hover'/>
                </Button.Group>
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
            nodeDIV = <NavLink href={nodeURL} tabIndex={this.props.item.get('focused') ? 0 : -1} ref={(el) => { this.nodeLink = el; }} onDoubleClick={this.handleRenameClick.bind(this, nodeSelector)} >
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
                    <i onClick={this.handleExpandIconClick.bind(this, nodeSelector)} className={iconClass} aria-hidden="true">  </i>
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
