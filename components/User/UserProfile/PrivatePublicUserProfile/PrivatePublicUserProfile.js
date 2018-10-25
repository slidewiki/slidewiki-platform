import PropTypes from 'prop-types';
import React from 'react';
import { List, Segment, Checkbox, Header } from 'semantic-ui-react';

import PublicUserData from '../PublicUserData';
import UserDecks from './UserDecks';
import UserCollections from '../../../DeckCollection/UserCollections';
import UserMenu from './UserMenu';
import UserRecommendations from '../UserRecommendations';
import classNames from 'classnames/bind';
import fetchUserDecks from '../../../../actions/user/userprofile/fetchUserDecks';

class PrivatePublicUserProfile extends React.Component {
    constructor(props){
        super(props);
    }

    showUserDecks(){
        return <UserDecks decks={this.props.decks} decksMeta={this.props.decksMeta} deckListType={this.props.categoryItem} loadMoreLoading={this.props.loadMoreLoading} loadMoreError={this.props.loadMoreError} user={this.props.user} loggedinuser={this.props.loggedinuser} />;
    }

    showUserCollections(){
        return <UserCollections user={this.props.user} loggedinuser={this.props.loggedinuser} loggedinUserId={this.props.loggedinUserId} />;
    }

    showUserRecommendactions(){
        return <UserRecommendations loggedinuser={this.props.loggedinuser} loggedinUserId={this.props.loggedinUserId} />;
    }

    chooseView(){
        switch(this.props.category){
            case 'playlists':
                return this.showUserCollections();
            case 'recommendations':
                return this.showUserRecommendactions();
            case 'deck':
            default:
                return this.showUserDecks();
        }
    }

    handleFilterChange(event, { value }) {
        this.context.executeAction(fetchUserDecks, {
            deckListType: this.props.categoryItem,
            params: {
                username: this.props.user.uname,
                sort: this.props.decksMeta.sort,
                status: value,
            }
        });
    }

    render() {
        let meta = this.props.decksMeta;
        let profileClasses = classNames({
            'tablet': this.props.loggedinuser && this.props.user.uname === this.props.loggedinuser,
            'computer': this.props.loggedinuser && this.props.user.uname === this.props.loggedinuser,
            'only': this.props.loggedinuser && this.props.user.uname === this.props.loggedinuser,
            'sixteen': true,
            'wide': true,
            'column': true
        });
        return (
          <div className = "ui vertically padded stackable grid container" >
              <div className = "four wide column" >
                <div className = "ui stackable grid ">
                  <div className = {profileClasses}>
                      <PublicUserData user={ this.props.user } loggedinuser={ this.props.loggedinuser } />
                  </div>
                  <div className = "sixteen wide column">
                      <UserMenu user={ this.props.user } loggedinuser={this.props.loggedinuser} choice={ this.props.category } />
                  { this.props.user.uname === this.props.loggedinuser && this.props.category !== 'playlists' && this.props.category !== 'recommendations' &&
                    <Segment>
                        <Header size='small' dividing >Publication status</Header>
                        <List>{
                            [
                                {value: 'any', text: 'All'},
                                {value: 'public', text: 'Published'},
                                {value: 'hidden', text: 'Unlisted'},
                            ].map((opt, index) => (
                                <List.Item key={index}>
                                    <Checkbox radio name='published_status' value={opt.value} disabled={!meta.status}
                                        aria-labelledby={`published_${opt.value}_label`} label={<label id={`published_${opt.value}_label`}>{opt.text}</label>}
                                        checked={meta.status === opt.value} onChange={this.handleFilterChange.bind(this)} />
                                </List.Item>
                            ))
                        }
                        </List>
                    </Segment>
                  }
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
    executeAction: PropTypes.func.isRequired
};

export default PrivatePublicUserProfile;
