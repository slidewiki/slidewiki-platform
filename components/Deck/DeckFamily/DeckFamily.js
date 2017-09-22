import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import DeckFamilyStore from '../../../stores/DeckFamilyStore';
import PopularDecks from '../../User/UserProfile/PopularDecks';
import loadMoreDeckFamily from '../../../actions/deckfamily/loadMoreDeckFamily';

class DeckFamily extends React.Component {
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
    loadMore(){
        context.executeAction(loadMoreDeckFamily, {
            params: {
                tag: this.props.DeckFamilyStore.tag
            },
            page: this.props.DeckFamilyStore.page + 1
        });
    }
    render() {

        // define load more results div
        let loadMoreDiv = '';

        if(this.props.DeckFamilyStore.hasMore){
            let loadMoreContent = <button className="ui button" onClick={this.loadMore.bind(this)}>Load More</button>;
            if(this.props.DeckFamilyStore.loadMoreLoading){
                loadMoreContent = <div className="ui active text loader">Loading</div>;
            }
            loadMoreDiv = <div key="loadMoreDiv" className="ui basic segment center aligned">
                {loadMoreContent}
            </div>;
        }

        return (
          <div className = "ui vertically padded stackable grid container" >
              <div className = "four wide column" >
              </div>
              <div className = "twelve wide column" >
                  <div className="ui segments">
                      {(this.props.DeckFamilyStore.loading) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                      <div className="ui secondary clearing segment">
                          <h2 className="ui left floated header">Decks for tag: {this.props.DeckFamilyStore.tag}</h2>

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
                        <PopularDecks size={0} decks={this.props.DeckFamilyStore.decks} sort={this.sortBy}/>
                      </div>
                      {loadMoreDiv}
                  </div>
              </div>
          </div>
        );
    }
}

DeckFamily.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
DeckFamily = connectToStores(DeckFamily, [DeckFamilyStore], (context, props) => {
    return {
        DeckFamilyStore: context.getStore(DeckFamilyStore).getState()
    };
});

export default DeckFamily;
