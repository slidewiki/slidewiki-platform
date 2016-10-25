import React from 'react';
import CategoryBox from './CategoryBox';
import UserSettings from './UserSettings';
import PopularDecks from './PopularDecks';
import PublicUserData from './PublicUserData';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';

class UserProfile extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    chooseView() {
        switch(this.props.UserProfileStore.category){
            case 'settings':
                return this.addScaffold(() => {switch(this.props.UserProfileStore.categoryItem){
                    case 'profile':
                        return this.displayUserSettings();
                        break;
                    case 'groups':
                        return this.displayUserGroups();
                        break;
                    default:
                        return '';
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
        return (<UserSettings user = { this.props.UserProfileStore.user } dimmer =  {this.props.UserProfileStore.dimmer} failures = { this.props.UserProfileStore.failures }/>);
    }

    displayUserGroups() {
        return (<h3>This feature is curently not implemented. Please wait for future realeses of SlideWiki</h3>);
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
