import React from 'react';
import ReactDom from 'react-dom';
import changeTo from '../../../actions/user/userprofile/categoryBox';

class CategoryBox extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    exchangeContent(dest){
        //TODO - Check for correct format and
        //Do this via flux flow - this.props.ImportStore.isAllowed
        this.context.executeAction(changeTo, {dest: dest});  // example copied from Import.js (that copied it from Deck.js)
    }

    render() {
        let active = 'selected active blue';

        return (
          <div className="ui vertical fluid buttons">
              <button className={ 'ui ' + ( this.props.toShow === 'decks' ? active : '' ) + ' button' } onClick={ this.exchangeContent.bind(this,'decks') }>
                <p><i className="icon folder"/> My Decks</p>
              </button>
              <button className={ 'ui ' + ( this.props.toShow === 'settings' ? active : '' ) + ' button' } onClick={ this.exchangeContent.bind(this,'settings') }>
                <p><i className="icon setting"/> Settings</p>
              </button>
              <button className={ 'ui ' + ( this.props.toShow === 'stats' ? active : '' ) + ' button' } onClick={ this.exchangeContent.bind(this, 'stats') }>
                <p><i className="icon bar chart"/> My Stats</p>
              </button>
          </div>
        );
    }
}

CategoryBox.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default CategoryBox;
