import React from 'react';
import ReactDom from 'react-dom';
import { Microservices } from '../../../configs/microservices';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import CategoryBox from './CategoryBox';
import UserSettings from './UserSettings';
import UserDecks from './UserDecks';

class UserProfile extends React.Component {
    componentDidMount() {}
    componentDidUpdate() {}

    render() {
        return ( <
            div className = "ui stackable grid page" >

            <div className = "four wide column" >
              <CategoryBox toShow = { this.props.UserProfileStore.toShow } />
              <div className = "ui hidden divider" />
            </div>

            <div className = "twelve wide column" >
              { this.props.UserProfileStore.toShow === 'decks' ? <UserDecks /> : '' }
              { this.props.UserProfileStore.toShow === 'settings' ? <UserSettings /> : '' }
              { this.props.UserProfileStore.toShow === 'stats' ? <p>This feature is curently not implemented. Please wait for future realeses of SlideWiki</p> : '' }
              </div>
            </div>
        );
    }
}

UserProfile.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
UserProfile = connectToStores(UserProfile, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore)
            .getState()
    };
});

export default UserProfile;
