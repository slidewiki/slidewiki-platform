import PropTypes from 'prop-types';
import React from 'react';
import Thumbnail from '../../common/Thumbnail';
import { NavLink } from 'fluxible-router';
import { timeSince } from '../../../common';
import { Microservices } from '../../../configs/microservices';
import { FormattedMessage, defineMessages } from 'react-intl';

class DeckCard extends React.Component {


    componentDidMount() { }

    componentDidUpdate() { }

    render() {
        // console.log('DeckCard: cardContent', this.props);

        let thumbnailURL = `${Microservices.file.uri}/thumbnail/slide/`;
        if (this.props.cardContent.firstSlide) {
            thumbnailURL += this.props.cardContent.firstSlide;
            if (this.props.cardContent.theme) {
                thumbnailURL += '/' + this.props.cardContent.theme;
            }
        } else {
            thumbnailURL = this.props.cardContent.picture;
        }
        let viewUrl = ['/deck', this.props.cardContent.deckID, this.props.cardContent.slug].join('/');
        let presentationUrl = ['/presentation', this.props.cardContent.deckID, this.props.cardContent.slug, this.props.cardContent.deckID].join('/');

        let cardTitle = this.props.cardContent.title;
        if (cardTitle.length > 25) cardTitle = cardTitle.slice(0, 24) + '…';

        let description = (this.props.cardContent.description && this.props.cardContent.description.length > 100) ? this.props.cardContent.description.slice(0, 99) + '...' : this.props.cardContent.description;
        let labels = this.props.cardContent.hidden ?
            defineMessages({
                label_text: {
                    id: 'user.deck.linkLabelUnlisted',
                    defaultMessage: 'Unlisted deck: {title}. Last updated {update} ago'
                },
            })
            : defineMessages({
                label_text: {
                    id: 'user.deck.linkLabel',
                    defaultMessage: 'Deck: {title}. Last updated {update} ago'
                },
            });
        let ariaLabel = this.context.intl.formatMessage(labels.label_text, { title: this.props.cardContent.title, update: timeSince((new Date(this.props.cardContent.updated))) });

        let hiddenRibbon = '';
        if (this.props.cardContent.hidden) {
            hiddenRibbon = <span className="ui red right ribbon label" tabIndex={-1}><FormattedMessage id='user.deckcard.unlisted' defaultMessage='Unlisted' /></span>;
        };
        let thumbnailAlt = this.props.cardContent.title + ' | ' + this.props.cardContent.deckID;
        return (
            <div className='ui card'>
                {this.props.newTab === true ? (
                    <a className="image" aria-hidden tabIndex='-1' href={viewUrl} target='_blank'>
                        <img src={thumbnailURL} alt={thumbnailAlt} />
                    </a>
                ) : (
                        <NavLink className="image" aria-hidden tabIndex='-1' href={viewUrl}>
                            <img src={thumbnailURL} alt={thumbnailAlt} />
                        </NavLink>
                    )}

                <div className="content">
                    <div className="header">
                        {this.props.newTab === true ? (
                            <a href={viewUrl} data-tooltip={this.props.cardContent.title} aria-label={ariaLabel} target='_blank'>{cardTitle}</a>
                        ) : (
                                <NavLink href={viewUrl} data-tooltip={this.props.cardContent.title} aria-label={ariaLabel} >{cardTitle}</NavLink>
                            )}
                    </div>
                    {hiddenRibbon}
                    <div>
                        <span className="right floated">
                            <FormattedMessage id="user.deckcard.likesnumber" defaultMessage='Number of likes'>
                                {
                                    (label) => <i className="thumbs up icon" aria-label={label}></i>
                                }
                            </FormattedMessage>
                            {' ' + this.props.cardContent.noOfLikes}
                        </span>
                        <FormattedMessage id="user.deckcard.lastupdate" defaultMessage='Last updated'>
                            {
                                (label) => <span aria-label={label}>{timeSince((new Date(this.props.cardContent.updated)))}</span>
                            }
                        </FormattedMessage>
                    </div>
                </div>
                <div className="bottom attached menu ui basic buttons">
                    <FormattedMessage id="user.deckcard.opendeck" defaultMessage='Open deck'>
                        {
                            (label) => <NavLink href={viewUrl} data-tooltip={label} role="button" className="ui icon button" aria-label={label}>
                                <i className="yellow open folder large icon" aria-hidden="true" ></i>
                            </NavLink>
                        }
                    </FormattedMessage>
                    <FormattedMessage id="user.deckcard.slideshow" defaultMessage='Open slideshow in new tab'>
                        {
                            (label) => <a href={presentationUrl} target="_blank" className="ui icon button" role="button" aria-label={label} data-tooltip={label}>
                                <i className="grey circle play large icon" aria-hidden="true" ></i>
                            </a>
                        }
                    </FormattedMessage>

                </div>
            </div>
        );
    }
}

DeckCard.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

export default DeckCard;
