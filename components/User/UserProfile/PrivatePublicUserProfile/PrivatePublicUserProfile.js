import React from 'react';
import PublicUserData from '../PublicUserData';
import UserDecks from './UserDecks';
import UserCollections from '../../../DeckCollection/UserCollections';
import UserMenu from './UserMenu';
import UserSharedDecks from './UserSharedDecks';

class PrivatePublicUserProfile extends React.Component {
    constructor(props){
        super(props);
    }

    showUserDecks(){
        return <UserDecks decks={this.props.decks} decksMeta={this.props.decksMeta} loadMoreLoading={this.props.loadMoreLoading} loadMoreError={this.props.loadMoreError} user={this.props.user} loggedinuser={this.props.loggedinuser} />;
    }

    showUserCollections(){
        return <UserCollections user={this.props.user} loggedinuser={this.props.loggedinuser} loggedinUserId={this.props.loggedinUserId} />;
    }

    showSharedDecks(){
        return <UserSharedDecks decks={this.props.decks} decksMeta={this.props.decksMeta} loadMoreLoading={this.props.loadMoreLoading} loadMoreError={this.props.loadMoreError} user={this.props.user} loggedinuser={this.props.loggedinuser} />;
    }

    chooseView(){
        switch(this.props.category){
            case 'collections':
                return this.showUserCollections();
            case 'deck':
            default:
                if(this.props.categoryItem === 'shared'){
                    return this.showSharedDecks();
                }
                return this.showUserDecks();
        }
    }

    render() {
        return (
          <div className = "ui vertically padded stackable grid container" >
              <div className = "four wide column" >
                  <PublicUserData user={ this.props.user } loggedinuser={ this.props.loggedinuser } />
                  <UserMenu user={ this.props.user } loggedinuser={this.props.loggedinuser} choice={ this.props.category } />
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
