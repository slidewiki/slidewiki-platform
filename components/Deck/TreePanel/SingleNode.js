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
        $(currentComp).find('.ui.dropdown').dropdown();
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
        let rightBtns = '';
        //change the node title style if it is selected
        let nodeTitle = this.props.item.title;
        if(slectorPath === this.props.selector.spath){
            nodeTitle = <strong> {nodeTitle} </strong>;
            rightBtns = (
                <div className="ui dropdown right floated" onClick={this.handleMenuClick.bind(this)}>
                  <i className="ellipsis horizontal icon"></i>
                  <div className="small menu">
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
                    {rightBtns}
                </div>
            </div>
        );
    }
}

export default SingleNode;
