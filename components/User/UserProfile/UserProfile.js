import React from 'react';
import CategoryBox from './CategoryBox';
import ProfileSettings from './ProfileSettings';
import AccountDeletion from './AccountDeletion';
import ChangePassword from './ChangePassword';
import PopularDecks from './PopularDecks';
import PublicUserData from './PublicUserData';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';

class UserProfile extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {
        if (this.props.UserProfileStore.dimmer.success === true)
            swal({
                type: 'success',
                text: '',
                title: 'Changes have been applied',
                timer: 2600,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
            .then(() => {}).catch(swal.noop);
        if (this.props.UserProfileStore.dimmer.userdeleted === true)
            swal({
                type: 'success',
                text: '',
                title: 'Your Account has been deleted',
                timer: 4000,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
            .then(() => {}).catch(swal.noop);
        if (this.props.UserProfileStore.dimmer.failure === true)
            swal({
                title: 'Error',
                text: 'Something went wrong',
                type: 'error',
                allowEscapeKey: false,
                allowOutsideClick: false,
                confirmButtonText: 'OK',
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            })
            .then(() => {}).catch(swal.noop);
    }

    chooseView() {
        switch(this.props.UserProfileStore.category){
            case 'settings':
                return this.addScaffold(() => {switch(this.props.UserProfileStore.categoryItem){
                    case 'profile':
                        return this.displayUserSettings();
                        break;
                    case 'account':
                        return this.displayAccounts();
                        break;
                    case 'integrations':
                        return this.displayAccountIntegrations();
                        break;
                    default:
                        return '';
                }});
            case 'groups':
                return this.addScaffold(() => {return '';});
            default:
                return this.displayUserProfile();
        };
    }

    addScaffold(toInsert){
        return (
            <div className = "ui stackable grid page" >
                <div className = "four wide column" >
                    <CategoryBox highlight = { this.props.UserProfileStore.categoryItem } username = { this.props.UserProfileStore.username }/>
                    <div className = "ui hidden divider" />
                </div>
                <div className = "twelve wide column" >
                    {toInsert()}
                </div>
            </div>
        );
    }

    displayUserSettings() {
        return (<ProfileSettings user = { this.props.UserProfileStore.user } failures = { this.props.UserProfileStore.failures }/>);
    }

    displayAccountIntegrations() {
        return (<h3>This feature is curently not implemented. Please wait for future realeses of SlideWiki</h3>);
    }

    displayAccounts() {
        return (<div>
            <div className="ui segments">
            <div className="ui secondary segment">
              <h3>Change password</h3>
            </div>

            <div className="ui segment">
              <ChangePassword failures={ this.props.UserProfileStore.failures }/>
            </div>
            </div>
            <div className="ui segments">
            <div className="ui red inverted segment">
              <h3>Deactivate account</h3>
            </div>

            <div className="ui segment">
              <AccountDeletion />
            </div>
            </div>
        </div>);
    }

    displayUserProfile() {
        return (
            <div className = "ui stackable grid page" >
                <div className = "four wide column" >
                    <PublicUserData user={ this.props.UserProfileStore.user }/>
                </div>
                <div className = "twelve wide column" >
                    <div className="ui segments">
                        {(this.props.UserProfileStore.userDecks === undefined) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                        <div className="ui secondary segment">
                            <h2>My Decks</h2>
                        </div>
                        <div className="ui segment">
                            <PopularDecks size={0}/>
                        </div>
                    </div>
                </div>
                <div className="ui tab" data-tab="activity">
            </div>
        </div>
        );
    }

    render() {
        return (this.chooseView());
    }
}

UserProfile.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

UserProfile = connectToStores(UserProfile, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default UserProfile;
