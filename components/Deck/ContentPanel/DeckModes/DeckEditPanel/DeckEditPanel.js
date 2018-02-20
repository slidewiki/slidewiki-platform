import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import DeckEditStore from '../../../../../stores/DeckEditStore';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import ContentUtil from '../../util/ContentUtil';
import {updateAuthorizedUsers, updateAuthorizedGroups} from '../../../../../actions/updateDeckAuthorizations';

import DeckPropertiesEditor from './DeckPropertiesEditor';


class DeckEditPanel extends React.Component {
    constructor(props){
        super(props);

        this.action = 0;
    }

    handleAuth(selector) {
        console.log('DeckEditPanel handleAuth:', selector);
        if (this.getParameterByName('interestedUser') && this.props.UserProfileStore.username === '') {
            return;
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

<<<<<<< HEAD
    getParameterByName(name) {
        try {
            let param = this.props.DeckEditStore.queryParams[name];
            return decodeURIComponent(param.replace(/\+/g, ' '));
        } catch (e) {
            // console.log('Not able to get query parameter!', e);
            return undefined;
        }
    }

    componentDidMount() {
        let interestedUser = this.getParameterByName('interestedUser');
        if (interestedUser && this.props.UserProfileStore.username === '') {
            $('.ui.login.modal').modal('show');
            return;
        }
        console.log('componentDidMount', interestedUser, this.props.DeckEditStore.deckProps.deckOwner, this.props.UserProfileStore.userid);
        if (interestedUser) {
            let users = this.props.DeckEditStore.authorizedUsers;
            if (users === undefined || users === null)
                users = [];
            let user = this.props.UserProfileStore.user;//TODO get interested user?
            if (this.props.DeckEditStore.deckProps.deckOwner !== this.props.UserProfileStore.userid) {
                swal({
                    title: 'Error',
                    text: 'You are not the deck owner, thus you are not allowed to change the deck edit rights.',
                    type: 'error',
                    confirmButtonText: 'Confirm',
                    confirmButtonClass: 'positive ui button',
                    buttonsStyling: false
                }).then().catch();
            }
            else if (this.props.DeckEditStore.deckProps.deckOwner === this.props.UserProfileStore.user.id) {
                swal({
                    title: 'Information',
                    text: 'You are the owner of the deck, thus you already have edit rights.',
                    type: 'info',
                    confirmButtonText: 'Confirm',
                    confirmButtonClass: 'positive ui button',
                    buttonsStyling: false
                }).then().catch();
            }
            else if (users.findIndex((member) => {
                return member.id === parseInt(user.id);
            }) !== -1) {
                swal({
                    title: 'Information',
                    text: 'Edit rights were already granted to the user.',
                    type: 'info',
                    confirmButtonText: 'Confirm',
                    confirmButtonClass: 'positive ui button',
                    buttonsStyling: false
                }).then().catch();
            }
            else {
                // console.log('deck props', this.props.DeckEditStore.deckProps);
                let username = this.props.UserProfileStore.user.fname + ' ' + this.props.UserProfileStore.user.lname + ' (' + this.props.UserProfileStore.user.uname + ')';
                if (!this.props.UserProfileStore.user.lname && !this.props.UserProfileStore.user.fname)
                    username = this.props.UserProfileStore.user.uname;
                let organization = '';
                if (this.props.UserProfileStore.user.organization) {
                    organization = ', organization: ' + this.props.UserProfileStore.user.organization;
                }

                swal({
                    title: 'Requested deck edit rights',
                    text: 'The following user requested edit rights on deck "' + this.props.DeckEditStore.deckProps.title + '":   ' + username + organization + '. Grant it?',
                    type: 'question',
                    showCloseButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Grant rights',
                    confirmButtonClass: 'ui olive button',
                    cancelButtonText: 'Deny',
                    cancelButtonClass: 'ui pink button',
                    buttonsStyling: false
                }).then((a) => {
                    console.log(a);//true
                    console.log('Try to push user to users', users, user);
                    users.push({
                        username: user.uname,
                        id: parseInt(user.id),
                        joined: (new Date()).toISOString(),
                        picture: user.picture,
                        country: user.country,
                        organization: user.organization
                    });
                    console.log('execute action');
                    this.action = 1;
                    this.context.executeAction(updateAuthorizedUsers, users);
                }, (b) => {console.log(b);}).catch();
            }
        }
    }

    componentDidUpdate() {
        console.log('DeckEditPanel componentDidUpdate', this.action);
        if (this.action === 1) {
            this.action = 0;
            document.getElementsByClassName('ui primary button')[0].click();
        }
    }

=======
>>>>>>> 01dfbf062215f0508a02965d4586b0e99e1222e0
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
