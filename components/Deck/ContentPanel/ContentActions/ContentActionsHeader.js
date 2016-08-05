import React from 'react';
import {NavLink} from 'fluxible-router';
import classNames from 'classnames/bind';
import ContentUtil from '../util/ContentUtil';

class ContentActionsHeader extends React.Component {

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
                    <div className={addSlideClass}>
                        <a className="" title="Add Slide">
                        <i className="icons">
                          <i className="grey file large text icon"></i>
                          <i className="inverted corner plus icon"></i>
                        </i>
                        </a>
                    </div>
                    <div className={addDeckClass}>
                        <a className="" title="Add Deck">
                        <i className="medium icons">
                          <i className="yellow large folder icon"></i>
                          <i className="inverted corner plus icon"></i>
                        </i>
                        </a>
                    </div>
                    <div className={duplicateItemClass}>
                        <a className="" title="Duplicate">
                            <i className="grey large copy icon"></i>
                        </a>
                    </div>
                    <div className={dueleteItemClass}>
                        <a className="" title="Delete">
                            <i className="red large trash icon"></i>
                        </a>
                    </div>
                    <div className="item ui small basic right attached button">
                        <a className="" title="Settings">
                            <i className="black large setting icon"></i>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default ContentActionsHeader;
