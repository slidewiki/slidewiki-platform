import React from 'react';
import classNames from 'classnames';
import Thumbnail from '../../Thumbnail/Thumbnail';
import { NavLink } from 'fluxible-router';
import { timeSince } from '../../../common';
import { Microservices } from '../../../configs/microservices';

class DeckCard extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        let thumbnailURL = Microservices.file.uri + '/' + this.props.userid + '/thumbnails/';
        if (this.props.cardContent.firstSlide) {
            thumbnailURL += this.props.cardContent.firstSlide + '.png';
        }
        else {
            thumbnailURL = this.props.cardContent.picture;
        }
        return (
            <div className='card'>
                <NavLink className="ui medium centered image" href={'/deck/' + this.props.cardContent.deckID}>
                    <Thumbnail url={thumbnailURL}
                        slideId={this.props.cardContent.firstSlide} />
                </NavLink>
                <div className="content">
                    <div className="header"><NavLink href={'/deck/' + this.props.cardContent.deckID}>{this.props.cardContent.title}}</NavLink></div>
                    <div className="meta">
                        <span className="date">Last updated {timeSince((new Date(this.props.cardContent.updated)))} ago</span>
                    </div>
                    <div className="description">
                        {this.props.cardContent.description}
                    </div>
                </div>
            </div>
        );
    }
}

DeckCard.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeckCard;
