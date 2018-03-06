import React from 'react';
import PublicUserData from '../PublicUserData';
import UserDecks from './UserDecks';
import UserCollections from '../../../DeckCollection/UserCollections';
import UserMenu from './UserMenu';

class PrivatePublicUserProfile extends React.Component {
    constructor(props){
        super(props);
    }

    showUserDecks(){
        return <UserDecks decks={this.props.decks} user={this.props.user} loggedinuser={this.props.loggedinuser} />;
    }

    showUserCollections(){
        return <UserCollections user={this.props.user} loggedinuser={this.props.loggedinuser} loggedinUserId={this.props.loggedinUserId} />;
    }

    chooseView(){
        switch(this.props.category){
            case 'collections':
                return this.showUserCollections();
            default:
                return this.showUserDecks();
        }
    }

    render() {
        return (
          <div className = "ui vertically padded stackable grid container" >
              <div className = "four wide column" >
                  <div className = "ui stackable grid ">
                    <div className = "tablet computer only sixteen wide column">
                        <PublicUserData user={ this.props.user } loggedinuser={ this.props.loggedinuser }/>
                    </div>
                    <div className = "sixteen wide column">
                        <UserMenu user={ this.props.user } loggedinuser={this.props.loggedinuser} choice={ this.props.category } />
                    </div>
                  </div>
              </div>
              <div className = "twelve wide column" >
                  {this.chooseView()}
              </div>
              <div className="ui tab" data-tab="activity"></div>
          </div>
        );
    }
}

PrivatePublicUserProfile.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default PrivatePublicUserProfile;
