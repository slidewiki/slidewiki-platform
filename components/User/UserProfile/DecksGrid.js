import PropTypes from 'prop-types';
import React from 'react';
import DeckCard from './DeckCard';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import { isEmpty } from './../../../common';
import { FormattedMessage, defineMessages } from 'react-intl';

class DecksGrid extends React.Component {

    render() {
        let size = 0;
        let content = this.props.decks;
        if (!isEmpty(content)) {
            // if no sort property is given the order of decks is preserved
            if (this.props.sort) {
                switch (this.props.sort) {
                    case '1':
                        content = content.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
                        break;
                    case '0':
                        content = content.sort((a, b) => (b.title.toUpperCase() < a.title.toUpperCase()) ? 1 : -1);
                        break;
                    case '2':
                    default:
                        content = content.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
                        break;
                }
            }
            if (this.props.size === 0)
                size = content.length;
            else
                size = content.length < 3 ? content.length : this.props.size;
            return (<div className="ui three stackable cards">
                {[...Array(size).keys()].map((i) => <DeckCard userid={this.props.UserProfileStore.user.id} key={i} cardContent={content[i]} newTab={this.props.newTab} />)}
            </div>);
        } else {
            return <h3><FormattedMessage id='user.populardecks.notavailable' defaultMessage='No decks available' /></h3>;
        }
    }
}

DecksGrid.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
DecksGrid = connectToStores(DecksGrid, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default DecksGrid;
