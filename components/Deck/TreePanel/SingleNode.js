import React from 'react';
import classNames from 'classnames/bind';
import {NavLink} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';

class SingleNode extends React.Component {
    handleClick(e){
        e.stopPropagation();
    }
    render() {
        let slectorPath = TreeUtil.makeSelectorPath(this.props.nodePath);
        //change the node title style if it is selected
        let nodeTitle = this.props.item.title;
        if(this.props.selector.spath){
            if(slectorPath === this.props.selector.spath){
                nodeTitle = <strong> {nodeTitle} </strong>;
            }
        }else{
            if((this.props.selector.stype === this.props.item.type) && parseInt(this.props.selector.sid) === parseInt(this.props.item.id)){
                nodeTitle = <strong> {nodeTitle} </strong>;
            }
        }
        //change the node icon based on the type of node
        let iconClass = classNames({
            'ui grey icon': true,
            'file text': (this.props.item.type === 'slide')
        });
        //adapt URLs based on the current page
        let nodeURL = TreeUtil.makeNodeURL({id: this.props.rootNode.id, stype: this.props.item.type, sid: this.props.item.id, spath: slectorPath, page: this.props.selector.page});

        return (
            <div className="item" onClick={this.handleClick.bind(this)}>
                <NavLink href={nodeURL}>
                    <i className={iconClass}></i>
                    {nodeTitle}
                </NavLink>
            </div>
        );
    }
}

export default SingleNode;
