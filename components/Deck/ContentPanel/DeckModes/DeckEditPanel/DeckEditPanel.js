import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import ContentUtil from '../../util/ContentUtil';

import DeckPropertiesEditor from './DeckPropertiesEditor';


class DeckEditPanel extends React.Component {
    handleAuth(selector) {
        if (this.getParameterByName('interestedUser') && this.props.UserProfileStore.username === '') {
            $('.ui.login.modal').modal('show');
            return; //TODO Modal should refresh current page?
        }

        const nodeURL = ContentUtil.makeNodeURL(selector, 'view');
        //user is not logged in
        if (this.props.UserProfileStore.username === '') {
            this.context.executeAction(navigateAction, {
                url: nodeURL
            });
        }
        return (<div>Sign-in needed!</div>);
    }

    getParameterByName(name) {
        try {
            let param = this.props.DeckEditStore.queryParams[name];
            return decodeURIComponent(param.replace(/\+/g, " "));
        } catch (e) {
            console.log('Not able to get query parameter!', e);
            return undefined;
        }
    }

    componentDidMount() {
        let interestedUser = this.getParameterByName('interestedUser');
        console.log('componentDidMount', interestedUser, this.props.DeckEditStore.deckProps.deckOwner, this.props.UserProfileStore.userid);
        if (interestedUser) {
            if (this.props.DeckEditStore.deckProps.deckOwner !== this.props.UserProfileStore.userid) {
                swal({
                    title: 'Error',
                    text: 'You are not the deck owner, thus you are not allowed to change the deck edit rights.',
                    type: 'error',
                    confirmButtonText: 'Confirm',
                    confirmButtonClass: 'negative ui button',
                    buttonsStyling: false
                }).then().catch();
                return;
            }
            else {
                console.log('deck props', this.props.DeckEditStore.deckProps);
                let username = this.props.UserProfileStore.user.fname + ' ' + this.props.UserProfileStore.user.lname + ' (' + this.props.UserProfileStore.user.uname + ')';
                if (!this.props.UserProfileStore.user.lname && !this.props.UserProfileStore.user.fname)
                    username = this.props.UserProfileStore.user.uname;

                let func = () => {
                    window.open(link);return false;
                };
                swal({
                    title: 'Requested deck edit rights',
                    text: 'The following user requested edit rights on deck "' + this.props.DeckEditStore.deckProps.title + '":   <a className="item" href="#">' + username + '</a>, organization: ' + this.props.UserProfileStore.user.organization + '. Grant it?',
                    type: 'question',
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Grant rights',
                    confirmButtonClass: 'ui olive button',
                    cancelButtonText: 'Deny',
                    cancelButtonClass: 'ui pink button',
                    buttonsStyling: false
                }).then().catch();
            }
        }
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
