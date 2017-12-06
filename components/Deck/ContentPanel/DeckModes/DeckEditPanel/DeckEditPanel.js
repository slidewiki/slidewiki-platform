import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import ContentUtil from '../../util/ContentUtil';

import DeckPropertiesEditor from './DeckPropertiesEditor';


class DeckEditPanel extends React.Component {
    handleAuth(selector) {
        const nodeURL = ContentUtil.makeNodeURL(selector, 'view');
        //user is not logged in
        if (this.props.UserProfileStore.username === '') {
            this.context.executeAction(navigateAction, {
                url: nodeURL
            });
        }
        return (<div>Sign-in needed!</div>);
    }
    render() {
        //make sure user is logged-in
        this.handleAuth(this.props.selector);

        return (
            <div ref="deckEditPanel" className="ui bottom attached segment">
                <DeckPropertiesEditor deckProps={this.props.DeckEditStore.deckProps}
                    selector={this.props.selector}
                    userid={this.props.UserProfileStore.userid}
                    groups={this.props.UserProfileStore.user.groups}/>
            </div>
        );
    }
}
DeckEditPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

DeckEditPanel = connectToStores(DeckEditPanel, [DeckEditStore, UserProfileStore], (context, props) => {
    return {
        DeckEditStore: context.getStore(DeckEditStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});
export default DeckEditPanel;
