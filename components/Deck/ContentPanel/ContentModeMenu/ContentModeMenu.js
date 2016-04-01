import React from 'react';
import {NavLink} from 'fluxible-router';
import ContentUtil from '../util/ContentUtil';
import {connectToStores} from 'fluxible-addons-react';
import TabLinksStore from '../../../../stores/TabLinksStore';

class ContentModeMenu extends React.Component {

    render() {
      let contentDetails = this.props.ContentStore;
      if(this.props.TabLinksStore.selector.page == 'contentmode'){
        contentDetails = this.props.TabLinksStore;
      }
        return (
            <div className="sw-content-panel" ref="contentModeMenu">
                <div className="ui top attached tabular menu">
                    <NavLink className={'item' + (contentDetails.mode === 'view' ? ' active' : '')} href={ContentUtil.makeNodeURL(contentDetails.selector, 'view')}>
                        View
                    </NavLink>
                    <NavLink className={'item' + (contentDetails.mode === 'edit' ? ' active' : '')} href={ContentUtil.makeNodeURL(contentDetails.selector, 'edit')}>
                        Edit
                    </NavLink>
                    <NavLink className={'item' + (contentDetails.mode === 'questions' ? ' active' : '')} href={ContentUtil.makeNodeURL(contentDetails.selector, 'questions')}>
                        Questions<span className="ui tiny label">{this.props.TabLinksStore.items.questions.count}</span>
                    </NavLink>
                    <NavLink className={'item' + (contentDetails.mode === 'datasources' ? ' active' : '')} href={ContentUtil.makeNodeURL(contentDetails.selector, 'datasources')}>
                        Data Sources<span className="ui tiny circular label">{this.props.TabLinksStore.items.dataSources.count}</span>
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

ContentModeMenu = connectToStores(ContentModeMenu, [TabLinksStore], (context, props) => {
    return {
        TabLinksStore: context.getStore(TabLinksStore).getState()
    };
});


export default ContentModeMenu;
