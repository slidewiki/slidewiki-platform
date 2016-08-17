import React from 'react';
import { navigateAction } from 'fluxible-router';
import loadActivities from '../../../actions/activityfeed/loadActivities';

class DeckListItem extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    switchToDeck(id) {
        context.executeAction(navigateAction, { url: '/deck/' + id });
    }

    exchangePrivateContent(id) {
        this.context.executeAction(loadActivities, { id: id + 'a', sid: '1122334455a' });
        return false;
    }

    render() {
        let toInsert,picToInsert = '';
        if (this.props.private === true) {
            toInsert =  <div>
                            <a className="header" onClick={ this.exchangePrivateContent.bind(this, this.props.deckID) }>{ this.props.title }</a>
                            <div className="description">
                                Updated { this.props.updated } mins ago
                            </div>
                            <br/>
                            <a onClick={ this.switchToDeck.bind(this, this.props.deckID) }>Go to deck</a>
                        </div>;
            picToInsert = <a onClick={ this.exchangePrivateContent.bind(this, this.props.deckID) }><img src={ this.props.picture }/></a>;
        } else {
            toInsert =  <div>
                            <a className="header" onClick={ this.switchToDeck.bind(this, this.props.deckID) }>{ this.props.title }</a>
                            <div className="description">Updated { this.props.updated } mins ago</div>
                        </div>;
            picToInsert = <a onClick={ this.switchToDeck.bind(this, this.props.deckID) }><img src={ this.props.picture }/></a>;
        }
        return (
            <div className="item">
                <div className="ui tiny image">
                    { picToInsert }
                </div>
                <div className="content">
                    { toInsert }
                </div>
            </div>
        );
    }
}

DeckListItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DeckListItem;
