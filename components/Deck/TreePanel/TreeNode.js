import React from 'react';
import {HotKeys} from 'react-hotkeys';
//import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import classNames from 'classnames/bind';
import {NavLink} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';

class TreeNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mouseover: 0, actionOn:0};
    }
    //do not re-render in case of same props wihtout selector and if mode has not changed
    shouldComponentUpdate(nextProps, nextState) {
        return ! (Immutable.is(nextProps.item, this.props.item) &&  nextProps === this.props.mode);
    }
    componentDidMount(){

    }
    componentDidUpdate(){

    }
    getKeyMap() {
        const keyMap = {
            'expandOrMenu': 'right',
            'collapseOrMenu': 'left'
        };
        return keyMap;
    }
    getKeyMapHandlers() {
        const handlers = {
            'expandOrMenu': (event) => this.handleRightKey(),
            'collapseOrMenu': (event) => this.handleLeftKey()
        };
        return handlers;
    }
    handleRightKey(){
        if(this.props.item.get('type') === 'deck'){
            if(!this.props.item.get('expanded')){
                this.props.onToggleNode({id: this.props.rootNode.id, stype: this.props.item.get('type'), sid: this.props.item.get('id'), spath: this.props.item.get('path')});
            }else{
                this.setState({actionOn: !this.state.actionOn});
            }
        }else{
            this.setState({actionOn: !this.state.actionOn});
        }
        return false;
    }
    handleLeftKey(){
        if(this.props.item.get('type') === 'deck'){
            if(this.props.item.get('expanded')){
                this.props.onToggleNode({id: this.props.rootNode.id, stype: this.props.item.get('type'), sid: this.props.item.get('id'), spath: this.props.item.get('path')});
            }
        }
        if(this.state.actionOn){
            this.setState({actionOn: !this.state.actionOn});
        }
        return false;
    }
    handleExpandIconClick(selector, e){
        this.props.onToggleNode(selector);
        e.stopPropagation();
    }
    handleAddClick(selector, nodeSpec, e){
        this.props.onAddNode(selector, nodeSpec);
        this.setState({actionOn: 0});
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
        this.setState({actionOn: 0});
        e.stopPropagation();
    }
    handleRenameClick(selector, e){
        this.props.onRename(selector);
        this.setState({actionOn: 0});
        e.stopPropagation();
    }
    handleMenuClick(e){
        this.setState({actionOn: !this.state.actionOn});
        e.stopPropagation();
    }
    handleEditFocus(e){
        //select all content
        e.target.select();
    }
    handleNameChange(e){
        console.log(e.target.value);
    }
    handleKeyDown(selector, e) {
        switch (e.keyCode) {
            //case 9: // Tab
            case 13: // Enter
                this.props.onSave(selector, this.props.item.get('title'), e.target.value);
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
                    <TreeNode onToggleNode={self.props.onToggleNode} onRename={self.props.onRename} onSave={self.props.onSave} onAddNode={self.props.onAddNode} onDeleteNode={self.props.onDeleteNode} item={node} rootNode={self.props.rootNode} key={index} page={self.props.page} mode={self.props.mode}/>
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
        let actionSignifier = <span className={actionSigClass} onClick={this.handleMenuClick.bind(this)}><i className="ui link ellipsis horizontal tiny icon right floated"></i></span>;
        actionBtnsClass = classNames({
            'hide-element': !this.state.actionOn,
            'ui right aligned': true
        });
        let actionBtns = (
            <div className={actionBtnsClass}>
                <div className="ui small basic icon compact fluid buttons">
                    <button className="ui button" onClick={this.handleAddClick.bind(this, nodeSelector, {type: 'slide', id: 0})} title="add slide">
                        <i className="plus square icon"></i>
                    </button>
                    <button className="ui button" onClick={this.handleAddClick.bind(this, nodeSelector, {type: 'deck', id: 0})} title="add deck">
                        <i className="add yellow square icon"></i>
                    </button>
                    <button className="ui button" title="Duplicate">
                        <i className="copy icon"></i>
                    </button>
                    <button className="ui button" onClick={this.handleRenameClick.bind(this, nodeSelector)} title="rename">
                        <i className="blue edit icon"></i>
                    </button>
                    <button className="ui button" onClick={this.handleDeleteClick.bind(this, nodeSelector)} title="delete">
                        <i className="red trash circle icon"></i>
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
        return (
            <div className="item" ref={this.props.item.get('path')}>
                <HotKeys className="item" ref={this.props.item.get('path')} keyMap={this.getKeyMap()} handlers={this.getKeyMapHandlers()}>
                    <div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}>
                        <i onClick={this.handleExpandIconClick.bind(this, nodeSelector)} className={iconClass}></i>
                        {nodeDIV}
                        {actionSignifier}
                    </div>
                    {actionBtns}
                    {childNodesDIV}
                </HotKeys>
            </div>
        );
    }
}

export default TreeNode;
