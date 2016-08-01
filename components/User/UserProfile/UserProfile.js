import React from 'react';
import ReactDom from 'react-dom';
import { Microservices } from '../../../configs/microservices';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import CategoryBox from './CategoryBox';
import UserSettings from './UserSettings';
import UserDecks from './UserDecks';
import PublicUserData from './PublicUserData';
import DeckListItem from './DeckListItem';
import PublicUserDecks from './PublicUserDecks';

class UserProfile extends React.Component {
    componentDidMount() {
        $('.menu .item').tab();
    }

    componentDidUpdate() {}

    publicOrPrivateProfile() {
        if(true){ //There is an JWT and id available and the caller id matches the user id
            return (
            <div className = "ui stackable grid page" >
              <div className = "four wide column" >
                <CategoryBox toShow = { this.props.UserProfileStore.toShow } />
                <div className = "ui hidden divider" />
              </div>
              <div className = "twelve wide column" >
                { this.props.UserProfileStore.toShow === 'decks' ? <UserDecks /> : '' }
                { this.props.UserProfileStore.toShow === 'settings' ? <UserSettings user = {this.props.UserProfileStore.user} dimmer =  {this.props.UserProfileStore.dimmer}/> : '' }
                { this.props.UserProfileStore.toShow === 'stats' ? <h3>This feature is curently not implemented. Please wait for future realeses of SlideWiki</h3> : '' }
              </div>
            </div>);
        } else { // just an id
            return (
                <div className = "ui stackable grid page" >
                    <div className = "four wide column" >
                        <PublicUserData user={this.props.UserProfileStore.user}/>
                    </div>
                    <div className = "twelve wide column" >
                        <div className="ui three item stackable pointing secondary demo tabular menu">
                            <div className="active item" data-tab="popular">Overview</div>
                            <div className="item" data-tab="userdecks">Decks</div>
                            <div className="item" data-tab="activity">Public activity</div>
                        </div>
                        <div className="ui active tab" data-tab="popular">
                            <PublicUserDecks />
                        </div>
                        <div className="ui tab" data-tab="userdecks">
                            <h3>This feature is curently not implemented. Please wait for future realeses of SlideWiki</h3>
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
