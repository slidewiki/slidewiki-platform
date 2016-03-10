import React from 'react';
import {NavLink} from 'fluxible-router';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import Tree from './Tree';

class TreePanel extends React.Component {
    handleFocus() {
        key.setScope('tree'); // will allow specific tree keyborad actions
    }
    handleBlur() {
        key.setScope('all'); // will disallow specific tree keyborad actions
    }
    handleAddNode(path) {
        if(!path){
            // it means the root node is selected
        }else{

        }
    }
    handleDeleteNode(path) {
        if(!path){
            // it means the root node is selected
        }else{

        }
    }
    render() {
        const rootNodeStyles = {
            fontSize: '1.06em'
        };
        const treeDIVStyles = {
            maxHeight: '400',
            overflowY: 'auto',
            padding: '0'
        };
        let rootNode = {title: this.props.DeckTreeStore.deckTree.title, id: this.props.DeckTreeStore.deckTree.id};
        let rootNodeTitle = rootNode.title;
        if(parseInt(this.props.DeckTreeStore.selector.sid) === parseInt(rootNode.id)){
            rootNodeTitle = <strong> {rootNodeTitle} </strong>;
        }
        return (
            <div className="ui panel sw-tree-panel" ref="treePanel" onFocus={this.handleFocus} onBlur={this.handleBlur}>
                <div className="ui segments">
                    <div className="2 fluid ui attached bottom tertiary small icon buttons">
                        <div className="ui button">
                            <i className="blue search icon"></i>
                        </div>
                        <div className="ui button">
                            <i className="black ellipsis horizontal icon"></i>
                        </div>
                    </div>
                    <div className="ui secondary segment">
                        <NavLink style={rootNodeStyles} href={'/deck/' + rootNode.id}>{rootNodeTitle}</NavLink>
                    </div>
                    <div className="ui segment" style={treeDIVStyles}>
                        <Tree selector={this.props.DeckTreeStore.selector} rootNode={rootNode} items={this.props.DeckTreeStore.deckTree.children} flatTree={this.props.DeckTreeStore.flatTree} mode={this.props.mode} onAddNode={this.handleAddNode} onDeleteNode={this.handleDeleteNode}/>
                    </div>
                </div>
             </div>
        );
    }
}

TreePanel = connectToStores(TreePanel, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default TreePanel;
