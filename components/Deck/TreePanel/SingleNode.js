import React from 'react';
import classNames from 'classnames/bind';
import {NavLink} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';

class SingleNode extends React.Component {
    constructor(props) {
        super(props);
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
        $(currentComp).find('.dropdown').dropdown();
    }
    handleClick(e){
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
    render() {
        let slectorPath = TreeUtil.makeSelectorPath(this.props.nodePath);
        let actionBtns = '';
        //change the node title style if it is selected
        let nodeTitle = this.props.item.title;
        if(slectorPath === this.props.selector.spath){
            nodeTitle = <strong> {nodeTitle} </strong>;
            actionBtns = (
                <div className="ui floating combo top right pointing dropdown icon right floated" onClick={this.handleMenuClick.bind(this)}>
                  <i className="ellipsis horizontal tiny icon"></i>
                  <div className="small menu">
                        <div className="item" onClick={this.handleAddClick.bind(this, slectorPath)}>
                            <i className="add circle icon"></i> New Slide
                        </div>
                        <div className="item">
                            <i className="add circle icon"></i> Existing Slide
                        </div>
                        <div className="item">
                            <i className="add circle icon"></i> New Deck
                        </div>
                        <div className="item" onClick={this.handleAddClick.bind(this, slectorPath)}>
                            <i className="add circle icon"></i> Existing Deck
                        </div>
                        <div className="item">
                            <i className="copy icon"></i> Duplicate
                        </div>
                        <div className="divider"></div>
                        <div className="item">
                            <i className="blue edit icon"></i> Rename
                        </div>
                        <div className="divider"></div>
                        <div className="item" onClick={this.handleDeleteClick.bind(this, slectorPath)}>
                            <i className="red trash circle icon"></i> Delete
                        </div>
                    </div>
                </div>
            );
        }
        //change the node icon based on the type of node
        let iconClass = classNames({
            'ui grey icon': true,
            'file text': (this.props.item.type === 'slide')
        });
        //adapt URLs based on the current page
        let nodeURL = TreeUtil.makeNodeURL({id: this.props.rootNode.id, stype: this.props.item.type, sid: this.props.item.id, spath: slectorPath, page: this.props.selector.page}, this.props.mode);
        return (
            <div className="item" onClick={this.handleClick.bind(this)} ref={slectorPath}>
                <div>
                    <i className={iconClass}></i>
                    <NavLink href={nodeURL}>
                        {nodeTitle}
                    </NavLink>
                    {actionBtns}
                </div>
            </div>
        );
    }
}

export default SingleNode;
