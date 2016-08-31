import React from 'react';
import UserDecks from './UserDecks';
import CategoryBox from './CategoryBox';
import UserSettings from './UserSettings';
import PublicUserData from './PublicUserData';
import PublicUserDecks from './PublicUserDecks';
import { navigateAction } from 'fluxible-router';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';

class UserProfile extends React.Component {
    componentDidMount() {
        $('.menu .item').tab();
    }

    componentDidUpdate() {
        $('.menu .item').tab();
        if(this.props.UserProfileStore.jwt === '' && this.props.UserProfileStore.toShow !== '')
            context.executeAction(navigateAction, { url: '/' });
    }

    publicOrPrivateProfile() {
        if(this.props.UserProfileStore.toShow !== ''  && this.props.UserProfileStore.username !== ''){
            return (
                <div className = "ui stackable grid page" >
                    <div className = "four wide column" >
                        <CategoryBox toShow = { this.props.UserProfileStore.toShow } username = { this.props.UserProfileStore.user.uname }/>
                        <div className = "ui hidden divider" />
                    </div>
                    <div className = "twelve wide column" >
                        { this.props.UserProfileStore.toShow === 'decks' ? <UserDecks /> : '' }
                        { this.props.UserProfileStore.toShow === 'settings' ? <UserSettings user = { this.props.UserProfileStore.user } dimmer =  {this.props.UserProfileStore.dimmer} failures = { this.props.UserProfileStore.failures }/> : '' }
                        { this.props.UserProfileStore.toShow === 'stats' ? <h3>This feature is curently not implemented. Please wait for future realeses of SlideWiki</h3> : '' }
                    </div>
                </div>
            );
        } else { // just an id
            return (
                <div className = "ui stackable grid page" >
                    <div className = "four wide column" >
                        <PublicUserData user={ this.props.UserProfileStore.user }/>
                    </div>
                    <div className = "twelve wide column" >
                        <div className="ui three item stackable pointing secondary demo tabular menu">
                            <div className="active link item" data-tab="popular">Overview</div>
                            <div className="link item" data-tab="userdecks">Decks</div>
                            <div className="link item" data-tab="activity">Public activity</div>
                        </div>
                        <div className="ui active tab" data-tab="popular">
                            <PublicUserDecks title={'Popular Decks'}/>
                        </div>
                        <div className="ui tab" data-tab="userdecks">
                            <PublicUserDecks title={'All Decks'}/>
                        </div>
                        <div className="ui tab" data-tab="activity">
                            <h3>This feature is curently not implemented. Please wait for future realeses of SlideWiki</h3>
                        </div>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (this.publicOrPrivateProfile());
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
