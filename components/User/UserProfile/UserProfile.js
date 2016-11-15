import React from 'react';
import CategoryBox from './CategoryBox';
import ChangePicture from './ChangePicture';
import ChangePassword from './ChangePassword';
import DeactivateAccount from './DeactivateAccount';
import ChangePersonalData from './ChangePersonalData';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import PrivatePublicUserProfile from './PrivatePublicUserProfile';
import { categories } from '../../../actions/user/userprofile/chooseAction';

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
            case categories.categories[0]:
                return this.addScaffold(() => {switch(this.props.UserProfileStore.categoryItem){
                    case categories.settings[0]:
                        return this.displayUserSettings();
                        break;
                    case categories.settings[1]:
                        return this.displayAccounts();
                        break;
                    case categories.settings[2]:
                    default:
                        return this.notImplemented();
                }});
            case categories.categories[1]:
                return this.addScaffold(() => {switch(this.props.UserProfileStore.categoryItem){
                    case categories.groups[0]:
                    default:
                        return this.notImplemented();
                }});
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
        return (
          <div>
              <div className="ui segments">

                  <div className="ui secondary segment">
                      <h3>Exchange picture</h3>
                  </div>
                  <div className="ui segment">
                      <ChangePicture user={ this.props.UserProfileStore.user }/>
                  </div>

              </div>
              <div className="ui segments">

                  <div className="ui secondary segment">
                      <h3>Alter my personal data</h3>
                  </div>
                  <div className="ui segment">
                      <ChangePersonalData user={ this.props.UserProfileStore.user } failures={ this.props.UserProfileStore.failures }/>
                  </div>

              </div>
          </div>);
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
              <h3>Deactivate Account</h3>
            </div>

            <div className="ui segment">
              <DeactivateAccount />
            </div>
            </div>
        </div>);
    }

    displayUserProfile() {
        return (<PrivatePublicUserProfile user={this.props.UserProfileStore.user} decks={this.props.UserProfileStore.userDecks}/>);
    }

    notImplemented() {
        return (<h3>This feature is curently not implemented. Please wait for future realeses of SlideWiki</h3>);
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
