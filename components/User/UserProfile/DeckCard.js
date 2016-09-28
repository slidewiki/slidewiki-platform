import React from 'react';
import classNames from 'classnames';
import { NavLink } from 'fluxible-router';
import { timeSince } from '../../../common';

class DeckCard extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    render() {
        return (
            <div className='card'>
                <NavLink className="ui medium centered image" href={'/deck/' + this.props.cardContent.deckID}>
                    <img src={ this.props.cardContent.picture }/>
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
                <div className="extra content">
                    <NavLink href={'/deck/' + this.props.cardContent.deckID}><i className="thumbs up icon"/>X</NavLink>
                    <NavLink href={'/deck/' + this.props.cardContent.deckID} className="right floated"><i className="fork icon"/>X</NavLink><br/>
                    <NavLink href={'/deck/' + this.props.cardContent.deckID}><i className="comment icon"/>X</NavLink>
                    <NavLink href={'/deck/' + this.props.cardContent.deckID} className="right floated"><i className="download icon"/>X</NavLink>
                </div>
            </div>
        );
    }
}

DeckCard.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeckCard;
