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
    toggleNode(e){
        e.stopPropagation();
        this.setState({expanded: !this.state.expanded});
    }
    render() {
        let self = this;
        let slectorPath = TreeUtil.makeSelectorPath(this.props.nodePath);
        //a multi node can have other multi nodes and single nodes
        let output = this.props.item.children.map((node, index) => {
            if(node.type === 'deck'){
                return (
                    <MultiNode item={node} selector={self.props.selector} rootNode={self.props.rootNode} key={index} nodePath={self.props.nodePath.concat([[node.id, index+1]])} nodePosition={index+1} />
                );
            }else{
                return (
                    <SingleNode item={node} selector={self.props.selector} rootNode={self.props.rootNode} key={index} nodePath={self.props.nodePath.concat([[node.id, index+1]])} nodePosition={index+1} />
                );
            }
        });
        //change the node title style if it is selected
        let nodeTitle = this.props.item.title;
        if(this.props.selector.spath){
            if(slectorPath === ('/' + this.props.selector.spath)){
                nodeTitle = <strong> {nodeTitle} </strong>;
            }
        }else{
            if((this.props.selector.stype === this.props.item.type) && parseInt(this.props.selector.sid) === parseInt(this.props.item.id)){
                nodeTitle = <strong> {nodeTitle} </strong>;
            }
        }
        //change the node icon based on the type of node and its expanded state
        let iconClass = classNames({
            'ui yellow folder icon': true,
            'folder': (this.props.item.type === 'deck'),
            'open': this.state.expanded
        });
        //show/hide sub nodes based on the expanded state
        let subNodes;
        if(this.state.expanded){
            subNodes = <div className="list"> {output} </div>;
        }else{
            subNodes = '';
        }
        return (
            <div className="item" onClick={this.toggleNode.bind(this)}>
                <NavLink href={'/deck/' + this.props.rootNode.id + '/' + this.props.item.type + '/' + this.props.item.id + slectorPath}>
                    <i className={iconClass}></i>
                    {nodeTitle}
                </NavLink>
                {subNodes}
            </div>
        );
    }
}

export default MultiNode;
