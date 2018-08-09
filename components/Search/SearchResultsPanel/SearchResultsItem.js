import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames/bind';
import { NavLink } from 'fluxible-router';
import {FormattedMessage, defineMessages} from 'react-intl';

class SearchResultsItem extends React.Component {

    constructor(props){
        super(props);
        this.messages = this.getIntlMessages();
    }
    getIntlMessages(){
        return defineMessages({
            otherVersions: {
                id: 'SearchResultsItem.otherVersions',
                defaultMessage: 'Other versions'
            },
            otherDeckVersion: {
                id: 'SearchResultsItem.otherVersions.deck',
                defaultMessage: 'Deck Version {index}: {title}'
            },
            otherSlideVersion: {
                id: 'SearchResultsItem.otherVersions.slide',
                defaultMessage: 'Also in Deck: {title}'
            },
            inDeck: {
                id: 'SearchResultsItem.inDeck',
                defaultMessage: 'in'
            },
            byUser: {
                id: 'SearchResultsItem.byUser',
                defaultMessage: 'by user'
            },
            owner: {
                id: 'SearchResultsItem.owner',
                defaultMessage: 'Owner'
            },
            slideLastModified: {
                id: 'SearchResultsItem.lastModified.slide',
                defaultMessage: 'Slide last modified: {date}'
            },
            deckLastModified: {
                id: 'SearchResultsItem.lastModified.deck',
                defaultMessage: 'Deck last modified: {date}'
            }

        });
    }

    render() {
        const result = this.props.data;

        // choose result icon
        let kindIcon =
            (result.kind === 'Slide')
                ?    <i className="large grey file text middle aligned icon" aria-label="slide"></i>
                :    <i className="large yellow folder open aligned icon" aria-label="deck"></i>;


        // form sublist items and expand button
        let expandButton = '';
        let subList = '';
        if(result.subItems && result.subItems.length > 0){
            expandButton = <button className="ui small button"><FormattedMessage {...this.messages.otherVersions} /></button>;

            subList = result.subItems.map( (item, index) => {
                if(result.kind === 'Deck'){
                    return <div className="row" key={item.id}>
                        <NavLink href={item.link}>
                            {
                                this.context.intl.formatMessage(this.messages.otherDeckVersion, {
                                    index: index+1,
                                    title: item.title
                                })
                            }
                        </NavLink>
                    </div>;
                }
                else if(result.kind === 'Slide'){
                    return <div className="row" key={item.id}>
                        <NavLink href={item.link}>
                            {
                                this.context.intl.formatMessage(this.messages.otherSlideVersion, {
                                    title: item.title
                                })
                            }
                        </NavLink>
                    </div>;
                }
            });
        }

        // form last line of the result item containing user info
        let userLine = '';
        let lastModifiedLine = '';

        if (result.kind === 'Slide'){
            userLine = <span><FormattedMessage {...this.messages.inDeck} /> <NavLink href={result.deck.link}>{result.deck.title}</NavLink> <FormattedMessage {...this.messages.byUser} /> <NavLink href={result.user.link}>{result.user.displayName || result.user.username}</NavLink></span>;
            lastModifiedLine = <span>{
                this.context.intl.formatMessage(this.messages.slideLastModified, {
                    date: result.lastUpdate
                })
            }</span>;
        } else if (result.kind === 'Deck') {
            userLine = <span><FormattedMessage {...this.messages.owner} />: <NavLink href={result.user.link}>{result.user.displayName || result.user.username}</NavLink></span>;
            lastModifiedLine = <span>{
                this.context.intl.formatMessage(this.messages.deckLastModified, {
                    date: result.lastUpdate
                })
            }</span>;
        }

        return (
            <div className="accordionItem">
                <div className="title">
                    <div className="ui middle aligned centered grid">
                        <div className="row">
                            <div className="twelve wide column">
                                <div className="ui grid">
                                    <div className="sixteen wide left aligned column">
                                        <div className="row">
                                            <h3><NavLink href={result.link}>{kindIcon}{result.title}</NavLink></h3>
                                        </div>
                                        <div className="row">
                                            {result.description}
                                        </div>
                                        <div className="row">
                                            {lastModifiedLine}
                                        </div>
                                        <div className="row">
                                            {userLine}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="four wide column">
                                {expandButton}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="ui centered grid">
                        <div className="fourteen wide left aligned column">
                            {subList}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

SearchResultsItem.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default SearchResultsItem;
