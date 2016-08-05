import React from 'react';
import {NavLink} from 'fluxible-router';
import classNames from 'classnames/bind';
import ContentUtil from '../util/ContentUtil';
import addTreeNode from '../../../../actions/decktree/addTreeNode';
import deleteTreeNodeAndNavigate from '../../../../actions/decktree/deleteTreeNodeAndNavigate';

class ContentActionsHeader extends React.Component {
    handleAddNode(selector, nodeSpec) {
        //selector: Object {id: "56", stype: "deck", sid: 67, spath: "67:2"}
        //nodeSec: Object {type: "slide", id: 0}
        this.context.executeAction(addTreeNode, {selector: selector, nodeSpec: nodeSpec});
    }
    handleDeleteNode(selector) {
        this.context.executeAction(deleteTreeNodeAndNavigate, selector);
    }
    render() {
        const contentDetails = this.props.ContentStore;
        //config buttons based on the selected item
        const addSlideClass = classNames({
            'item ui small basic left attached button': true,
            'disabled': contentDetails.selector.id === contentDetails.selector.sid
        });
        const addDeckClass = classNames({
            'item ui small basic left attached button': true,
            'disabled': contentDetails.selector.id === contentDetails.selector.sid
        });
        const duplicateItemClass = classNames({
            'item ui small basic left attached button': true,
            'disabled': contentDetails.selector.id === contentDetails.selector.sid
        });
        const dueleteItemClass = classNames({
            'item ui small basic left attached button': true,
            'disabled': contentDetails.selector.id === contentDetails.selector.sid
        });
        return (
            <div className="ui top attached tabular menu">
                <NavLink className={'item' + (contentDetails.mode === 'view' ? ' active' : '')} href={ContentUtil.makeNodeURL(contentDetails.selector, 'view')}>
                    View
                </NavLink>
                <NavLink className={'item' + (contentDetails.mode === 'edit' ? ' active' : '')} href={ContentUtil.makeNodeURL(contentDetails.selector, 'edit')}>
                    <i className="ui large blue edit icon "></i> Edit
                </NavLink>
                <div className="right menu">
                    <button className={addSlideClass}>
                        <a className="" title="Add Slide" onClick={this.handleAddNode.bind(this, contentDetails.selector, {type: 'slide', id: 0})}>
                        <i className="icons">
                          <i className="grey file large text icon"></i>
                          <i className="inverted corner plus icon"></i>
                        </i>
                        </a>
                    </button>
                    <button className={addDeckClass} onClick={this.handleAddNode.bind(this, contentDetails.selector, {type: 'deck', id: 0})}>
                        <a className="" title="Add Deck">
                        <i className="medium icons">
                          <i className="yellow large folder icon"></i>
                          <i className="inverted corner plus icon"></i>
                        </i>
                        </a>
                    </button>
                    <button className={duplicateItemClass} onClick={this.handleAddNode.bind(this, contentDetails.selector, {type: contentDetails.selector.stype, id: contentDetails.selector.sid})}>
                        <a className="" title="Duplicate">
                            <i className="grey large copy icon"></i>
                        </a>
                    </button>
                    <button className={dueleteItemClass} onClick={this.handleDeleteNode.bind(this, contentDetails.selector)}>
                        <a className="" title="Delete">
                            <i className="red large trash icon"></i>
                        </a>
                    </button>
                    <button className="item ui small basic right attached button">
                        <a className="" title="Settings">
                            <i className="black large setting icon"></i>
                        </a>
                    </button>
                </div>
            </div>
        );
    }
}
ContentActionsHeader.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default ContentActionsHeader;
