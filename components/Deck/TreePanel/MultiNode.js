import React from 'react';
import classNames from 'classnames/bind';
import {NavLink} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';
import SingleNode from './SingleNode';

class MultiNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {expanded: true};
    }
    componentDidMount(){
        this.activateDropDown();
    }
    componentDidUpdate(){
        //activate drop down
        //todo: apply it only when it is selected
        this.activateDropDown();
    }
    activateDropDown() {
        let currentComp = this.refs[this.props.selector.spath];
        $(currentComp).find('.ui.dropdown').dropdown();
    }
    handleClick(e){
        e.stopPropagation();
    }
    handleIconClick(e){
        this.toggleNode();
        e.stopPropagation();
    }
    handleAddClick(slectorPath){
        this.props.onAddNode(slectorPath);
    }
    handleDeleteClick(slectorPath){
        this.props.onDeleteNode(slectorPath);
    }
    handleMenuClick(e){
        e.stopPropagation();
    }
    toggleNode(){
        this.setState({expanded: !this.state.expanded});
    }
    render() {
        let self = this;
        let rightBtns = '';
        let slectorPath = TreeUtil.makeSelectorPath(this.props.nodePath);
        //a multi node can have other multi nodes and single nodes
        let output = this.props.item.children.map((node, index) => {
            if(node.type === 'deck'){
                return (
                    <MultiNode onAddNode={self.props.onAddNode} onDeleteNode={self.props.onDeleteNode} item={node} selector={self.props.selector} rootNode={self.props.rootNode} key={index} nodePath={self.props.nodePath.concat([[node.id, index+1]])} nodePosition={index+1} mode={self.props.mode}/>
                );
            }else{
                return (
                    <SingleNode onAddNode={self.props.onAddNode} onDeleteNode={self.props.onDeleteNode} item={node} selector={self.props.selector} rootNode={self.props.rootNode} key={index} nodePath={self.props.nodePath.concat([[node.id, index+1]])} nodePosition={index+1} mode={self.props.mode}/>
                );
            }
        });
        //change the node title style if it is selected
        let nodeTitle = this.props.item.title;
        if(slectorPath === this.props.selector.spath){
            nodeTitle = <strong> {nodeTitle} </strong>;
            rightBtns = (
                <div className="ui compact dropdown right floated" onClick={this.handleMenuClick.bind(this)}>
                  <i className="ellipsis horizontal icon"></i>
                  <div className="menu">
                        <div className="item" onClick={this.handleAddClick.bind(this, slectorPath)}>
                            Append a new slide
                        </div>
                        <div className="item">
                            Append an existing slide
                        </div>
                        <div className="divider"></div>
                        <div className="item">
                            Append an existing deck
                        </div>
                        <div className="item" onClick={this.handleAddClick.bind(this, slectorPath)}>
                            Append a new deck
                        </div>
                        <div className="divider"></div>
                        <div className="item">
                            Append a copy
                        </div>
                        <div className="divider"></div>
                        <div className="item">
                            Rename
                        </div>
                        <div className="divider"></div>
                        <div className="item" onClick={this.handleDeleteClick.bind(this, slectorPath)}>
                            Delete
                        </div>
                    </div>
                </div>
            );
        }
        //change the node icon based on the type of node and its expanded state
        let iconClass = classNames({
            'ui yellow folder icon': true,
            'caret': (this.props.item.type === 'deck'),
            'open': this.state.expanded,
            'folder link': true
        });
        let subnodeClass = classNames({
            'list': true,
            'hide-element': !this.state.expanded
        });
        //show/hide sub nodes based on the expanded state
        let subNodes = <div className={subnodeClass}> {output} </div>;
        //adapt URLs based on the current page
        let nodeURL = TreeUtil.makeNodeURL({id: this.props.rootNode.id, stype: this.props.item.type, sid: this.props.item.id, spath: slectorPath, page: this.props.selector.page}, this.props.mode);

        return (
            <div className="item" onClick={this.handleClick.bind(this)} ref={slectorPath}>
                <div>
                    <i className={iconClass} onClick={this.handleIconClick.bind(this)}></i>
                    <NavLink href={nodeURL}>
                        {nodeTitle}
                    </NavLink>
                    {rightBtns}
                </div>
                {subNodes}
            </div>
        );
    }
}

export default MultiNode;
