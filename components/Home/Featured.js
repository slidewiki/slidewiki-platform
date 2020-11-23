import React from 'react';
import DeckList from './DeckList';
import {Container, Header} from 'semantic-ui-react';
import { FormattedMessage, defineMessages} from 'react-intl';
import setDocumentTitle from '../../actions/setDocumentTitle';
import PropTypes from 'prop-types';

class Featured extends React.Component {
    componentDidMount() {
        this.context.executeAction(setDocumentTitle, { 
            title: this.context.intl.formatMessage({
                id: 'featured.title',
                defaultMessage: 'Featured Decks'
            })
        });
    }

    render() {

        return (
            <Container>
                <Header as="h1" id="main" style={{marginTop: '1em'}}><FormattedMessage id="featured.header" defaultMessage="Featured decks"/></Header>
                <div className="ui twelve wide container">
                <DeckList scope="featured"/>
                </div>
            </Container>
        );
    }
}

Featured.contextTypes = {
    intl: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired
};


export default Featured;
