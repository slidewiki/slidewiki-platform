import React from 'react';
import ReactDom from 'react-dom';
import {connectToStores} from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import changeToMyDecks from '../../../actions/user/userprofile/categoryBox';
import changeToSettings from '../../../actions/user/userprofile/categoryBox';
import changeToMyStats from '../../../actions/user/userprofile/categoryBox';

class CategoryBox extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    myDecksClicked(){
        //TODO - Check for correct format and
        //Do this via flux flow - this.props.ImportStore.isAllowed
        this.context.executeAction(changeToMyDecks, {});  // example copied from Import.js (that copied it from Deck.js)
        return false;
    }

    settingsClicked(){
        //TODO - Check for correct format and
        //Do this via flux flow - this.props.ImportStore.isAllowed
        this.context.executeAction(changeToSettings, {});  // example copied from Import.js (that copied it from Deck.js)
        return false;
    }

    myStatsClicked(){
        //TODO - Check for correct format and
        //Do this via flux flow - this.props.ImportStore.isAllowed
        this.context.executeAction(changeToMyStats, {});  // example copied from Import.js (that copied it from Deck.js)
        return false;
    }

    render() {
        let decks,settings,stats = '';
        switch(this.props.UserProfileStore.toShow){
            case 'settings':
                settings = 'selected active';
                break;
            case 'stats':
                stats = 'selected active';
                break;
            default:
                decks = 'selected active';
        }

        return (
          <div className="ui vertical fluid buttons">
              <button className="ui button" onClick={this.myDecksClicked.bind(this)}>
                <p><i className="icon folder {decks}"/> My Decks</p>
              </button>
              <button className="ui blue button" onClick={this.settingsClicked.bind(this)}>
                <p><i className="icon setting {settings}"/> Settings</p>
              </button>
              <button className="ui button" onClick={this.myStatsClicked.bind(this)}>
                <p><i className="icon bar chart {stats}"/> My Stats</p>
              </button>
          </div>
        );
    }
}

CategoryBox.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
CategoryBox = connectToStores(CategoryBox, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default CategoryBox;
