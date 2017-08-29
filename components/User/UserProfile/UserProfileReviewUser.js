import React from 'react';
import { getIntlLanguage } from '../../../common.js';
import CategoryBox from './CategoryBox';
import ChangePicture from './ChangePicture';
import ChangePassword from './ChangePassword';
import DeactivateAccount from './DeactivateAccount';
import ChangePersonalData from './ChangePersonalData';
import UserGroups from './UserGroups';
import UserGroupEdit from './UserGroupEdit';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import UserReviewStore from '../../../stores/UserReviewStore';
import UserProfileReviewDecks from './UserProfileReviewDecks';
import Integrations from './Integrations';
import { categories } from '../../../actions/user/userprofile/chooseAction';
import getNextReviewableUser from '../../../actions/userreview/getNextReviewableUser';
import saveSecret from '../../../actions/userreview/saveSecret';

class UserProfileReviewUser extends React.Component {
    componentDidMount() {
        let userProfileStore = this.props.UserProfileStore;
        if (!((userProfileStore.username !== undefined && userProfileStore.username !== null && userProfileStore.username !== '')
          && (userProfileStore.userid !== undefined && userProfileStore.userid !== null && userProfileStore.userid !== '')
          && (userProfileStore.jwt !== undefined && userProfileStore.jwt !== null && userProfileStore.jwt !== ''))) {

            $('.ui.login.modal').modal('show');
        } else if (!this.props.UserReviewStore.secretCorrect) {
            swal({
                input: 'password',
                text: 'What is the secret?',
                title: 'Secret',
                showCancelButton: true
            })
            .then((secret) => {
                this.context.executeAction(saveSecret, {
                    secret: secret
                });
            }).catch(swal.noop);
        }
    }

    componentDidUpdate() {
        if (!this.props.UserReviewStore.secretCorrect) {
            swal({
                input: 'password',
                text: 'What is the secret?',
                title: 'Secret',
                showCancelButton: true
            })
            .then((secret) => {
                this.context.executeAction(saveSecret, {
                    secret: secret
                });
            }).catch(swal.noop);
        }
        if (this.props.UserReviewStore.dimmer.approve === true) {
            swal({
                type: 'warning',
                text: 'Do you want to review another?',
                title: 'User approved',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            })
            .then(() => {
                this.context.executeAction(getNextReviewableUser, {




                    new: true,



                    secret: this.props.UserReviewStore.secret
                });
            },).catch(swal.noop);
        } else if (this.props.UserReviewStore.dimmer.suspend === true) {
            swal({
                type: 'warning',
                text: 'Do you want to review another?',
                title: 'User suspended',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            })
            .then(() => {
                this.context.executeAction(getNextReviewableUser, {
                    secret: this.props.UserReviewStore.secret
                });
            },).catch(swal.noop);
        } else if (this.props.UserReviewStore.dimmer.keepreviewing === true) {
            swal({
                type: 'warning',
                text: 'Do you want to review another?',
                title: 'User returned to the queue',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            })
            .then(() => {
                this.context.executeAction(getNextReviewableUser, {
                    secret: this.props.UserReviewStore.secret
                });
            },).catch(swal.noop);
        }
    }

    render() {
        return (<UserProfileReviewDecks user={this.props.UserProfileStore.user} decks={this.props.UserProfileStore.userDecks} loggedinuser={this.props.UserProfileStore.username} />);
    }
}

UserProfileReviewUser.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

UserProfileReviewUser = connectToStores(UserProfileReviewUser, [UserProfileStore,UserReviewStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        UserReviewStore: context.getStore(UserReviewStore).getState()
    };
});

export default UserProfileReviewUser;
