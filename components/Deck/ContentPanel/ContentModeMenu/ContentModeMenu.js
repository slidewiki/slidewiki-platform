import React from 'react';
import {NavLink} from 'fluxible-router';
import ContentUtil from '../util/ContentUtil';

class ContentModeMenu extends React.Component {
    render() {
        return (
            <div className="sw-content-panel" ref="contentModeMenu">
                <div className="ui top attached tabular menu">
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'view' ? ' active' : '')} href={ContentUtil.makeNodeURL(this.props.ContentStore.selector, 'view')}>
                        View
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'edit' ? ' active' : '')} href={ContentUtil.makeNodeURL(this.props.ContentStore.selector, 'edit')}>
                        Edit
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'questions' ? ' active' : '')} href={ContentUtil.makeNodeURL(this.props.ContentStore.selector, 'questions')}>
                        Questions<span className="ui tiny label">12</span>
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'datasources' ? ' active' : '')} href={ContentUtil.makeNodeURL(this.props.ContentStore.selector, 'datasources')}>
                        Data Sources<span className="ui tiny circular label">2</span>
                    </NavLink>
                    <div className="item">
                        <a title="print">
                            <i className="large print icon"></i>
                        </a>
                        <a title="export">
                            <i className="large share external icon"></i>
                        </a>
                        <a title="play">
                            <i className="large green circle play icon"></i>
                        </a>
                    </div>
                </div>
             </div>
        );
    }
}

export default ContentModeMenu;
