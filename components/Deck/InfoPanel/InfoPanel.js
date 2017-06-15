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
import InfoPanelHeader from './InfoPanelHeader';
import InfoPanelInfoView from './InfoPanelInfoView';


class InfoPanel extends React.Component {

    render() {
        const rootNodeStyles = {
            fontSize: '1.06em'
        };


        let deckTree = this.props.DeckTreeStore.deckTree;
        let selector = this.props.DeckTreeStore.selector;
        let prevSelector = this.props.DeckTreeStore.prevSelector;
        let nextSelector = this.props.DeckTreeStore.nextSelector;
        let rootNode = {'title': deckTree.get('title'), 'id': deckTree.get('id')};


        return (
            <div className="ui panel sw-info-panel" ref="infoPanel" >
                <div className="ui segments">
                  <InfoPanelHeader   />
                  <InfoPanelInfoView rootNode={rootNode} />
                </div>
            </div>
        );
    }
}

InfoPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
InfoPanel = connectToStores(InfoPanel, [SlideViewStore, UserProfileStore, PermissionsStore, DeckTreeStore], (context, props) => {
    return {
        SlideViewStore: context.getStore(SlideViewStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState(),

    };
});
export default InfoPanel;
