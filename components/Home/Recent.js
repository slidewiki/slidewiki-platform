import React from 'react';
import DeckList from './DeckList';
import {Container, Header} from 'semantic-ui-react';
import { FormattedMessage, defineMessages} from 'react-intl';

class Recent extends React.Component {
    render() {
        return (
            <Container>
                <Header as="h2" style={{marginTop: '1em'}}><FormattedMessage id="recent.header" defaultMessage="Recent decks added by users"/></Header>
                <DeckList scope="recent"/>
            </Container>
        );
    }
}

export default Recent;
