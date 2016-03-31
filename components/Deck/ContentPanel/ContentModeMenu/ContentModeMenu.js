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
      console.log("contentDetails", contentDetails);
      console.log(this.props.TabLinksStore);
        return (
<<<<<<< HEAD
<<<<<<< HEAD
            <div className="sw-content-panel" ref="contentModeMenu">
                <div className="ui top attached tabular menu">
                    <NavLink className={'item' + (contentDetails.mode === 'view' ? ' active' : '')} href={ContentUtil.makeNodeURL(contentDetails.selector, 'view')}>
                        View
                    </NavLink>
                    <NavLink className={'item' + (contentDetails.mode === 'edit' ? ' active' : '')} href={ContentUtil.makeNodeURL(contentDetails.selector, 'edit')}>
                        Edit
                    </NavLink>
                    <NavLink className={'item' + (contentDetails.mode === 'questions' ? ' active' : '')} href={ContentUtil.makeNodeURL(contentDetails.selector, 'questions')}>
                        Questions<span className="ui tiny label">12</span>
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
=======
=======
>>>>>>> 02570b5ff9a175d9c4271d1d7999f844ed800d4c
            <div className="ui top attached tabular menu" ref="contentModeMenu">
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
<<<<<<< HEAD
>>>>>>> 02570b5ff9a175d9c4271d1d7999f844ed800d4c
=======
>>>>>>> 02570b5ff9a175d9c4271d1d7999f844ed800d4c
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
