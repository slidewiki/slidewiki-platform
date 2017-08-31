import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import UserReviewStore from '../../../stores/UserReviewStore';
import getNextReviewableUser from '../../../actions/userreview/getNextReviewableUser';

class UserProfileReview extends React.Component {
    componentDidMount() {
        let userProfileStore = this.props.UserProfileStore;
        if (!((userProfileStore.username !== undefined && userProfileStore.username !== null && userProfileStore.username !== '')
          && (userProfileStore.userid !== undefined && userProfileStore.userid !== null && userProfileStore.userid !== '')
          && (userProfileStore.jwt !== undefined && userProfileStore.jwt !== null && userProfileStore.jwt !== ''))) {

            $('.ui.login.modal').modal('show');
        }
    }

    componentDidUpdate() {
        if (!this.props.UserReviewStore.secretCorrect) {
            let title = ( this.props.UserReviewStore.secret === '') ? 'Secret' : 'Authorization failed. Try again.'
            swal({
                input: 'password',
                text: 'What is the secret?',
                title: title,
                showCancelButton: true
            })
            .then((secret) => {
                this.context.executeAction(getNextReviewableUser, {
                    secret: secret,
                    jwt: this.props.UserProfileStore.jwt
                });
            }).catch(swal.noop);
        } else if (this.props.UserReviewStore.dimmer.noreviewables === undefined){
            this.context.executeAction(getNextReviewableUser, {
                secret: this.props.UserReviewStore.secret,
                jwt: this.props.UserProfileStore.jwt
            });
        } else if (this.props.UserReviewStore.dimmer.noreviewables) {
            swal({
                type: 'success',
                text: 'There are no users for review.',
                title: 'No users',
                timer: 4000,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });
        }
    }

    render() {
        return null;
    }
}

UserProfileReview.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

UserProfileReview = connectToStores(UserProfileReview, [UserProfileStore,UserReviewStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        UserReviewStore: context.getStore(UserReviewStore).getState()
    };
});

export default UserProfileReview;
