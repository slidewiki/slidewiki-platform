import React from 'react';
//import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import classNames from 'classnames/bind';
import {NavLink} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';

class TreeNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mouseover: 0};
    }
    //do not re-render in case of same props wihtout selector and if mode has not changed
    shouldComponentUpdate(nextProps, nextState) {
        return ! (Immutable.is(nextProps.item, this.props.item) &&  nextProps === this.props.mode);
    }
    componentDidMount(){

    }
    componentDidUpdate(){

    }
    handleExpandIconClick(selector, e){
        this.props.onToggleNode(selector);
        e.stopPropagation();
    }
    handleAddClick(selector, nodeSpec, e){
        this.props.onAddNode(selector, nodeSpec);
        e.stopPropagation();
    }
    handleMouseOver(e){
        this.setState({mouseover: 1});
        e.stopPropagation();
    }
    handleMouseOut(e){
        this.setState({mouseover: 0});
        e.stopPropagation();
    }
    handleDeleteClick(selector, e){
        this.props.onDeleteNode(selector);
        e.stopPropagation();
    }
    handleRenameClick(selector, e){
        this.props.onRename(selector);
        e.stopPropagation();
    }
    handleUndoRenameClick(selector, e){
        this.props.onDoRename(selector);
        e.stopPropagation();
    }
    handleMenuClick(selector, e){
        this.props.onSwitchOnAction(selector);
        e.stopPropagation();
    }
    handleEditFocus(e){
        //select all content
        e.target.select();
    }
    handleNameChange(e){
        //console.log(e.target.value);
    }
    handleKeyDown(selector, e) {
        switch (e.keyCode) {
            //case 9: // Tab
            case 13: // Enter
                if(e.target.value.trim()){
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
        //adapt URLs based on the current page
        let nodeSelector = {id: this.props.rootNode.id, stype: this.props.item.get('type'), sid: this.props.item.get('id'), spath: this.props.item.get('path')};
        let nodeURL = TreeUtil.makeNodeURL(nodeSelector, this.props.page, this.props.mode);
        let childNodes = '';
        let  childNodesDIV = '';
        let childNodesClass = '';
        let actionSigClass = '';
        let actionBtnsClass = '';
        if(this.props.item.get('type') === 'deck'){
            childNodes = this.props.item.get('children').map((node, index) => {
                return (
                    <TreeNode onToggleNode={self.props.onToggleNode} onSwitchOnAction={self.props.onSwitchOnAction} onRename={self.props.onRename} onUndoRename={self.props.onUndoRename} onSave={self.props.onSave} onAddNode={self.props.onAddNode} onDeleteNode={self.props.onDeleteNode} item={node} rootNode={self.props.rootNode} key={index} page={self.props.page} mode={self.props.mode}/>
                );
            });
            //show/hide sub nodes based on the expanded state
            childNodesClass = classNames({
                'list': true,
                'hide-element': !self.props.item.get('expanded')
            });
            childNodesDIV = <div className={childNodesClass}> {childNodes} </div>;
        }
        actionSigClass = classNames({
            'hide-element': !this.props.item.get('selected') && !this.state.mouseover
        });
        let actionSignifier = <span className={actionSigClass} onClick={this.handleMenuClick.bind(this, nodeSelector)}><i className="ui link ellipsis horizontal icon right floated"></i></span>;
        actionBtnsClass = classNames({
            'hide-element': !this.props.item.get('onAction'),
            'ui right aligned': true
        });
        const duplicateItemClass = classNames({
            'ui button': true,
            'disabled': this.props.item.get('type') === 'deck'
        });
        let actionBtns = (
            <div className={actionBtnsClass}>
                <div className="ui small basic icon compact fluid buttons">
                    <button className="ui button" onClick={this.handleAddClick.bind(this, nodeSelector, {type: 'slide', id: 0})} title="add slide">
                        <i className="icons">
                          <i className="file text icon"></i>
                          <i className="inverted corner plus icon"></i>
                        </i>
                    </button>
                    <button className="ui button" onClick={this.handleAddClick.bind(this, nodeSelector, {type: 'deck', id: 0})} title="add deck">
                        <i className="medium icons">
                          <i className="yellow folder icon"></i>
                          <i className="inverted corner plus icon"></i>
                        </i>
                    </button>
                    <button className={duplicateItemClass} title="Duplicate" onClick={this.handleAddClick.bind(this, nodeSelector, {type: this.props.item.get('type'), id: this.props.item.get('id')})} title="duplicate">
                        <i className="copy icon"></i>
                    </button>
                    <button className="ui button" onClick={this.handleDeleteClick.bind(this, nodeSelector)} title="delete">
                        <i className="red trash circle icon"></i>
                    </button>
                    <button className="ui button" title="Settings">
                        <i className="black setting icon"></i>
                    </button>
                </div>
            </div>
        );
        //change the node title style if it is selected
        let nodeTitle = this.props.item.get('title');
        let nodeTitleDIV = nodeTitle;
        if(this.props.item.get('selected')){
            nodeTitleDIV = <strong> {nodeTitle} </strong>;
        }
        let nodeDIV = '';
        if(this.props.item.get('editable')){
            nodeDIV = <input autoFocus onFocus={this.handleEditFocus} type="text" defaultValue={nodeTitle} onChange={this.handleNameChange} onKeyDown={this.handleKeyDown.bind(this, nodeSelector)}/>;
            actionSignifier = '';
        }else{
            nodeDIV = <NavLink href={nodeURL} onDoubleClick={this.handleRenameClick.bind(this, nodeSelector)}>{nodeTitleDIV}</NavLink>;
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
            outline: 'none'
        };
        return (
            <div className="item" ref={this.props.item.get('path')} style={compStyle}>
                <div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}>
                    <i onClick={this.handleExpandIconClick.bind(this, nodeSelector)} className={iconClass}></i>
                    {nodeDIV}
                    {actionSignifier}
                </div>
                {actionBtns}
                {childNodesDIV}
            </div>
        );
    }
}

export default TreeNode;
