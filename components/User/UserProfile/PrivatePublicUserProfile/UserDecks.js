import PropTypes from 'prop-types';
import React from 'react';
import PopularDecks from '../PopularDecks';
import { navigateAction } from 'fluxible-router';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Button, Icon } from 'semantic-ui-react';
import fetchUserDecks from '../../../../actions/user/userprofile/fetchUserDecks';
import { fetchNextUserDecks } from '../../../../actions/user/userprofile/fetchNextUserDecks';

class UserDecks extends React.Component {
    constructor(props) {
        super(props);
        this.messages = this.getIntlMessages();
    }
    componentDidMount() {
        $(this.refs.sortDropdown).dropdown({ onChange: this.dropdownSelect.bind(this) });
    }

    componentDidUpdate() { }

    dropdownSelect(value) {
        this.context.executeAction(fetchUserDecks, {
            deckListType: this.props.deckListType,
            params: {
                username: this.props.user.uname,
                sort: value,
                status: this.props.decksMeta.status,
            }
        });
    }
    loadMore(nextLink) {
        this.context.executeAction(fetchNextUserDecks, {
            nextLink: nextLink
        });
    }
    getIntlMessages() {
        return defineMessages({
            sortLastUpdated: {
                id: 'UserDecks.sort.lastUpdated',
                defaultMessage: 'Last updated'
            },
            sortCreationDate: {
                id: 'UserDecks.sort.date',
                defaultMessage: 'Creation date'
            },
            sortTitle: {
                id: 'UserDecks.sort.title',
                defaultMessage: 'Title'
            },
            myDecks: {
                id: 'UserDecks.header.myDecks',
                defaultMessage: 'My Decks'
            },
            ownedDecks: {
                id: 'UserDecks.header.ownedDecks',
                defaultMessage: 'Owned Decks'
            },
            sharedDecks: {
                id: 'UserDecks.header.sharedDecks',
                defaultMessage: 'Shared Decks'
            }
        });
    }
    getSelectedSort(sortBy) {
        switch (sortBy) {
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
        if (meta.links && meta.links.next) {
            let loadMoreContent = <button className="ui button" aria-label='Load more decks' onClick={this.loadMore.bind(this, meta.links.next)}><FormattedMessage id='user.userProfile.userDecks.loadMore' defaultMessage='Load More' /></button>;
            if (this.props.loadMoreLoading) {
                loadMoreContent = <div className="ui active text loader"><FormattedMessage id='user.userProfile.userDecks.loading' defaultMessage='Loading' /></div>;
            }
            if (this.props.loadMoreError) {
                loadMoreContent = <FormattedMessage id='user.userProfile.userDecks.error' defaultMessage='An unexpected error occurred while fetching more decks' />;
            }
            loadMoreDiv = <div key="loadMoreDiv" className="ui basic segment center aligned">
                {loadMoreContent}
            </div>;
        }
        let sortBy = meta.sort;
        let showHidden = meta.status && meta.status !== 'public';

        let headerMessage;
        if (this.props.deckListType === 'shared') {
            headerMessage = this.messages.sharedDecks;
        } else if (this.props.loggedinuser === this.props.user.uname) {
            headerMessage = this.messages.myDecks;
        } else {
            headerMessage = this.messages.ownedDecks;
        }
        let header = this.context.intl.formatMessage(headerMessage);

        return (
            <div className="ui segments">
                {(this.props.decks === undefined) ? <div className="ui active dimmer"><div className="ui text loader"><FormattedMessage id='user.userProfile.userDecks.loading' defaultMessage='Loading' /></div></div> : ''}
                <div className="ui secondary clearing segment">
                    <h1 className="ui left floated header">{header}</h1>

                    <div style={{ float: 'right' }}>

                        <div className="ui pointing labeled icon dropdown button" ref="sortDropdown">
                            <i className="icon exchange" />
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
                    {(this.props.decks) &&
                        <PopularDecks size={0} decks={this.props.decks} />
                    }
                </div>
                {loadMoreDiv}
            </div>
        );
    }
}

UserDecks.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default UserDecks;
