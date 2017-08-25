import React from 'react';
import PopularDecks from './PopularDecks';
import PublicUserData from './PublicUserData';
let classNames = require('classnames');

class UserProfileReviewDecks extends React.Component {
    constructor(props){
        super(props);
        this.sortBy = '2';
    }
    componentDidMount() {
        $(this.refs.sortDropdown).dropdown({onChange: this.dropdownSelect.bind(this)});
    }

    componentDidUpdate() {}

    dropdownSelect(value) {
        this.sortBy = value;
        this.forceUpdate();
    }


    handleApproveClick() {

    }
    handleSuspendClick() {

    }
    handleKeepReviewingClick() {

    }
    render() {
        // check if we should disable buttons?
        let disabled = false;

        let btn_classes = classNames({
            'ui': true,
            'labeled': true,
            'disabled': disabled,
            'icon': true,
            'basic': true,
            'button': true
        });
        let approveBtn_classes = classNames({'green': true}, btn_classes);
        let suspendBtn_classes = classNames({'red': true}, btn_classes);
        let keepBtn_classes = classNames({'blue': true}, btn_classes);

        return (
          <div className = "ui vertically padded stackable grid container" >
              <div className = "four wide column" >
                  <PublicUserData user={ this.props.user } loggedinuser= { this.props.loggedinuser }/>
                  <div className="vertical ui buttons">
                      <button tabIndex="0" type="button" onClick={this.handleApproveClick.bind(this)} className={approveBtn_classes} >
                          <i className="icon check"/> APPROVE USER
                      </button>
                      <div className="or"/>
                      <button tabIndex="0" type="button" onClick={this.handleSuspendClick.bind(this)} className={suspendBtn_classes}>
                          <i className="icon close"/> SUSPEND USER
                      </button>
                      <div className="or"/>
                      <button tabIndex="0" type="button" onClick={this.handleKeepReviewingClick.bind(this)} className={keepBtn_classes}>
                          <i className="icon undo"/> KEEP REVIEWING
                      </button>
                    </div>
              </div>
              <div className = "twelve wide column" >
                  <div className="ui segments">
                      {(this.props.decks === undefined) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                      <div className="ui secondary clearing segment">
                          <h2 className="ui left floated header">{(this.props.loggedinuser === this.props.user.uname) ? 'My Decks' : 'Owned Decks' }</h2>
                          <div className="ui right floated pointing labeled icon dropdown button" ref="sortDropdown">
                              <i className="icon exchange"/>
                              <div className="text">Last updated</div>
                              <div className="menu">
                                  <div className="item active selected" data-value={2}>Last updated</div>
                                  <div className="item" data-value={1}>Creation date</div>
                                  <div className="item" data-value={0}>Title</div>
                              </div>
                          </div>
                      </div>
                      <div className="ui segment">
                          <PopularDecks size={0} decks={this.props.decks} sort={this.sortBy}/>
                      </div>
                  </div>
              </div>
              <div className="ui tab" data-tab="activity"></div>
          </div>
        );
    }
}

UserProfileReviewDecks.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserProfileReviewDecks;
