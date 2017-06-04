import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import UserProfileStore from '../../../stores/UserProfileStore';
import Tree from '../TreePanel/Tree';
import toggleTreeNode from '../../../actions/decktree/toggleTreeNode';
import switchOnActionTreeNode from '../../../actions/decktree/switchOnActionTreeNode';
import renameTreeNode from '../../../actions/decktree/renameTreeNode';
import undoRenameTreeNode from '../../../actions/decktree/undoRenameTreeNode';
import saveTreeNode from '../../../actions/decktree/saveTreeNode';
import deleteTreeNodeAndNavigate from '../../../actions/decktree/deleteTreeNodeAndNavigate';
import addTreeNodeAndNavigate from '../../../actions/decktree/addTreeNodeAndNavigate';
import forkDeck from '../../../actions/decktree/forkDeck';
import moveTreeNodeAndNavigate from '../../../actions/decktree/moveTreeNodeAndNavigate';
import PermissionsStore from '../../../stores/PermissionsStore';
import SlideViewStore from '../../../stores/SlideViewStore';
import InfoPanel from './InfoPanel';
import ActivityList from '../ActivityFeedPanel/ActivityList';


class InfoPanelInfoView extends React.Component {

    render() {

        return (

                <div className="ui segments">
                  <div className="ui bottom attached active tab segment">
                    <div className="ui compact segments">
                      <h4 className="header item">{this.props.rootNode.title}</h4>
                    </div>
                  </div>
                  <div className={['ui', 'segment']}>
                    <div className="ui compact segments">
                      <h4 className="header item">Activity Feed</h4>
                    </div>
                    <ActivityList />
                  </div>

                  <div className={['ui', 'segment']}>
                    <div className='item'>
                      <div className={['ui', 'image']}>
                        <a href="http://creativecommons.org/licenses/by-sa/4.0/">
                          <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
                        </a>
                      </div>
                      <div className="description">
                        <p>
                          This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/" data-reactid="1575">Creative Commons Attribution-ShareAlike 4.0 International License</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
        );
    }
}

InfoPanelInfoView= connectToStores(InfoPanelInfoView, [SlideViewStore, UserProfileStore, PermissionsStore, DeckTreeStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),

    };
});
export default InfoPanelInfoView;
