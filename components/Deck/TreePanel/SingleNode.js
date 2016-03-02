import React from 'react';
import classNames from 'classnames/bind';
import {NavLink} from 'fluxible-router';
import TreeUtil from './util/TreeUtil';

class SingleNode extends React.Component {
    handleClick(e){
        e.stopPropagation();
        key.setScope('tree'); // will allow specific tree keyborad actions
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
        return (
            <div className="item" onClick={this.handleClick.bind(this)}>
                <NavLink href={'/deck/' + this.props.rootNode.id + '/' + this.props.item.type + '/' + this.props.item.id + '/' + slectorPath}>
                    <i className={iconClass}></i>
                    {nodeTitle}
                </NavLink>
            </div>
        );
    }
}

export default SingleNode;
