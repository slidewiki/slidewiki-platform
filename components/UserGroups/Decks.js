import PropTypes from 'prop-types';
import React from 'react';
import PopularDecks from '../User/UserProfile/PopularDecks';
import { navigateAction } from 'fluxible-router';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Button, Icon } from 'semantic-ui-react';
import fetchGroupDecks from '../../actions/usergroups/fetchGroupDecks';
import { fetchNextUserDecks } from '../../actions/user/userprofile/fetchNextUserDecks';

class Decks extends React.Component {
    constructor(props){
        super(props);
        this.messages = this.getIntlMessages();
    }
    componentDidMount() {
        $(this.refs.sortDropdown).dropdown({onChange: this.dropdownSelect.bind(this)});
    }

    componentDidUpdate() { }

    dropdownSelect(value) {
        this.context.executeAction(fetchGroupDecks, {
            params: {
                groupid: this.props.groupid,
                sort: value,
                status: this.props.decksMeta.status,
            }
        });
    }
    loadMore(nextLink){ //TODO
        // this.context.executeAction(fetchNextUserDecks, {
        //     nextLink: nextLink
        // });
    }
    getIntlMessages(){
        return defineMessages({
            sortLastUpdated: {
                id: 'GroupDecks.sort.lastUpdated',
                defaultMessage: 'Last updated'
            },
            sortCreationDate: {
                id: 'GroupDecks.sort.date',
                defaultMessage: 'Creation date'
            },
            sortTitle: {
                id: 'GroupDecks.sort.title',
                defaultMessage: 'Title'
            },
            sharedDecks: {
                id: 'GroupDecks.header.sharedDecks',
                defaultMessage: 'Shared Decks'
            }
        });
    }
    getSelectedSort(sortBy){
        switch(sortBy){
            case 'timestamp':
                return this.context.intl.formatMessage(this.messages.sortCreationDate);
            case 'title':
                return this.context.intl.formatMessage(this.messages.sortTitle);
            case 'lastUpdate':
            default:
                return this.context.intl.formatMessage(this.messages.sortLastUpdated);
        }
    }

    render() {
         // define load more results div
        let loadMoreDiv = '';
        let meta = this.props.decksMeta;
        if(meta.links && meta.links.next){
            let loadMoreContent = <button className="ui button" aria-label='Load more decks' onClick={this.loadMore.bind(this, meta.links.next)}>Load More</button>;
            if(this.props.loadMoreLoading){
                loadMoreContent = <div className="ui active text loader">Loading</div>;
            }
            if(this.props.loadMoreError){
                loadMoreContent = 'An unexpected error occurred while fetching more decks';
            }
            loadMoreDiv = <div key="loadMoreDiv" className="ui basic segment center aligned">
                {loadMoreContent}
            </div>;
        }
        let sortBy = meta.sort;
        let showHidden = meta.status && meta.status !== 'public';

        let headerMessage = this.messages.sharedDecks;
        let header = this.context.intl.formatMessage(headerMessage);

        return (
          <div className="ui segments">
            {(this.props.decks === undefined) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
            <div className="ui secondary clearing segment">
                <h1 className="ui left floated header">{header}</h1>

                <div style={{ float: 'right' }}>

                <div className="ui pointing labeled icon dropdown button" ref="sortDropdown">
                    <i className="icon exchange"/>
                    <div className="text">{this.getSelectedSort(sortBy)}</div>
                    <div className="menu">
                        <div className={(sortBy === 'lastUpdate') ? 'item active selected' : 'item'} data-value='lastUpdate'>{this.context.intl.formatMessage(this.messages.sortLastUpdated)}</div>
                        <div className={(sortBy === 'timestamp') ? 'item active selected' : 'item'} data-value='timestamp'>{this.context.intl.formatMessage(this.messages.sortCreationDate)}</div>
                        <div className={(sortBy === 'title') ? 'item active selected' : 'item'} data-value='title'>{this.context.intl.formatMessage(this.messages.sortTitle)}</div>
                    </div>
                </div>

                </div>
            </div>
            <div className="ui segment">
                { (this.props.decks) &&
                    <PopularDecks size={0} decks={this.props.decks} />
                }
            </div>
            {loadMoreDiv}
          </div>
        );
    }
}

Decks.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default Decks;
