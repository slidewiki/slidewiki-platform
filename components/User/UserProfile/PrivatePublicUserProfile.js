import React from 'react';
import PopularDecks from './PopularDecks';
import PublicUserData from './PublicUserData';

class PrivatePublicUserProfile extends React.Component {
    constructor(props){
        super(props);
        this.sortBy = '0';
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
          <div className = "ui stackable grid page" >
              <div className = "four wide column" >
                  <PublicUserData user={ this.props.user }/>
              </div>
              <div className = "twelve wide column" >
                  <div className="ui segments">
                      {(this.props.decks === undefined) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                      <div className="ui secondary clearing segment">
                          <h2 className="ui left floated header">My Decks</h2>
                          <div className="ui right floated pointing labeled icon dropdown button" ref="sortDropdown">
                              <i className="icon exchange"/>
                              <div className="text">Title</div>
                              <div className="menu">
                                  <div className="item active selected" data-value={0}>Title</div>
                                  <div className="item" data-value={1}>Creation date</div>
                                  <div className="item" data-value={2}>Last updated</div>
                              </div>
                          </div>
                      </div>
                      <div className="ui segment">
                          <PopularDecks size={0} decks={this.props.decks} sort={this.sortBy}/>
                      </div>
                  </div>
              </div>
              <div className="ui tab" data-tab="activity">
          </div>
      </div>
    );
    }
}

PrivatePublicUserProfile.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default PrivatePublicUserProfile;
