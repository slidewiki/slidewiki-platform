import React from 'react';
import PopularDecks from '../PopularDecks';

class UserDecks extends React.Component {
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

    render() {
        return (
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
        );
    }
}

UserDecks.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserDecks;
