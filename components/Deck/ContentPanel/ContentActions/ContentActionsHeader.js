import React from 'react';
import {NavLink} from 'fluxible-router';
import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
import ContentUtil from '../util/ContentUtil';
import DeckTreeStore from '../../../../stores/DeckTreeStore';

import addTreeNodeAndNavigate from '../../../../actions/decktree/addTreeNodeAndNavigate';
import deleteTreeNodeAndNavigate from '../../../../actions/decktree/deleteTreeNodeAndNavigate';

class ContentActionsHeader extends React.Component {
    handleAddNode(selector, nodeSpec) {
        //selector: Object {id: "56", stype: "deck", sid: 67, spath: "67:2"}
        //nodeSec: Object {type: "slide", id: 0}
        this.context.executeAction(addTreeNodeAndNavigate, {selector: selector, nodeSpec: nodeSpec});
    }
    handleDeleteNode(selector) {
        this.context.executeAction(deleteTreeNodeAndNavigate, selector);
    }
    render() {
        const contentDetails = this.props.ContentStore;
        //config buttons based on the selected item
        const addSlideClass = classNames({
            'item ui small basic left attached button': true
        });
        const addDeckClass = classNames({
            'item ui small basic left attached button': true
        });
        const duplicateItemClass = classNames({
            'item ui small basic left attached button': true,
            'disabled': contentDetails.selector.id === contentDetails.selector.sid || contentDetails.selector.stype==='deck'
        });
        const dueleteItemClass = classNames({
            'item ui small basic left attached button': true,
            'disabled': contentDetails.selector.id === contentDetails.selector.sid
        });
        let selectorImm = this.props.DeckTreeStore.selector;
        let selector = {id: selectorImm.get('id'), stype: selectorImm.get('stype'), sid: selectorImm.get('sid'), spath: selectorImm.get('spath')};
        return (
            <div className="ui top attached tabular menu">
                <NavLink className={'item' + (contentDetails.mode === 'view' ? ' active' : '')} href={ContentUtil.makeNodeURL(selector, 'view')}>
                    View
                </NavLink>
                <NavLink className={'item' + (contentDetails.mode === 'edit' ? ' active' : '')} href={ContentUtil.makeNodeURL(selector, 'edit')}>
                    <i className="ui large blue edit icon "></i> Edit
                </NavLink>
                <div className="right menu">
                    <button className={addSlideClass}>
                        <a className="" title="Add Slide" onClick={this.handleAddNode.bind(this, selector, {type: 'slide', id: 0})}>
                        <i className="icons">
                          <i className="grey file large text icon"></i>
                          <i className="inverted corner plus icon"></i>
                        </i>
                        </a>
                    </button>
                    <button className={addDeckClass} onClick={this.handleAddNode.bind(this, selector, {type: 'deck', id: 0})}>
                        <a className="" title="Add Deck">
                        <i className="medium icons">
                          <i className="yellow large folder icon"></i>
                          <i className="inverted corner plus icon"></i>
                        </i>
                        </a>
                    </button>
                    <button className={duplicateItemClass} onClick={this.handleAddNode.bind(this, selector, {type: selector.stype, id: selector.sid})}>
                        <a className="" title="Duplicate">
                            <i className="grey large copy icon"></i>
                        </a>
                    </button>
                    <button className={dueleteItemClass} onClick={this.handleDeleteNode.bind(this, selector)}>
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
//it should listen to decktree store in order to handle adding slides/decks
ContentActionsHeader = connectToStores(ContentActionsHeader, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default ContentActionsHeader;
