import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import RecommendedDecks from './RecommendedDecks';
import UserRecommendationsStore from '../../../stores/UserRecommendationsStore';

class UserRecommendations extends React.Component {
    constructor(props){
        super(props);
        this.sortBy = '3';
    }
    componentDidMount() {
        $(this.refs.sortDropdown).dropdown({onChange: this.dropdownSelect.bind(this)});
    }

    componentDidUpdate() {}

    dropdownSelect(value) {
        this.sortBy = value;
        this.forceUpdate();
    }

    render() {
        return (
          <div className="ui segments">
            {(this.props.UserRecommendationsStore.loading) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
            <div className="ui secondary clearing segment">
                <h1 className="ui left floated header">'Recommended Decks'</h1>
                <div className="ui right floated pointing labeled icon dropdown button" ref="sortDropdown">
                    <i className="icon exchange" aria-label="change order" />
                    <div className="text">Ranking</div>
                    <div className="menu">
                        <div className="item active selected" data-value={3}>Ranking</div>
                        <div className="item" data-value={2}>Last updated</div>
                        <div className="item" data-value={1}>Creation date</div>
                        <div className="item" data-value={0}>Title</div>
                    </div>
                </div>
            </div>
            <div className="ui segment">
                <RecommendedDecks decks={this.props.UserRecommendationsStore.recommendations} sort={this.sortBy}/>
            </div>
          </div>
        );
    }
}

UserRecommendations.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
UserRecommendations = connectToStores(UserRecommendations, [UserRecommendationsStore], (context, props) => {
    return {
        UserRecommendationsStore: context.getStore(UserRecommendationsStore).getState()
    };
});

export default UserRecommendations;
