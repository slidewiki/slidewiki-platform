import React from 'react';
import {NavLink} from 'fluxible-router';
import ContentUtil from '../util/ContentUtil';

class ContentActionsHeader extends React.Component {

    render() {
        let contentDetails = this.props.ContentStore;
        return (
            <div className="ui top attached tabular menu">
                <NavLink className={'item' + (contentDetails.mode === 'view' ? ' active' : '')} href={ContentUtil.makeNodeURL(contentDetails.selector, 'view')}>
                    View
                </NavLink>
                <NavLink className={'item' + (contentDetails.mode === 'edit' ? ' active' : '')} href={ContentUtil.makeNodeURL(contentDetails.selector, 'edit')}>
                    <i className="ui large blue edit icon "></i> Edit
                </NavLink>
                <div className="right menu">
                    <div className="item ui small basic left attached button">
                        <a className="" title="Duplicate">
                        <i className="icons">
                          <i className="grey file large text icon"></i>
                          <i className="inverted corner plus icon"></i>
                        </i>
                        </a>
                    </div>
                    <div className="item ui small basic left attached button">
                        <a className="" title="Add Deck">
                        <i className="medium icons">
                          <i className="yellow large folder icon"></i>
                          <i className="inverted corner plus icon"></i>
                        </i>
                        </a>
                    </div>
                    <div className="item ui small basic left attached button">
                        <a className="" title="Duplicate">
                            <i className="grey large copy icon"></i>
                        </a>
                    </div>
                    <div className="item ui small basic left attached button">
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
