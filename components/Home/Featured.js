import React from 'react';
import DeckList from './DeckList';
import {Container, Header} from 'semantic-ui-react';
import { FormattedMessage, defineMessages} from 'react-intl';

class Featured extends React.Component {
    render() {

        return (
            <Container>
                <Header as="h2" style={{marginTop: '1em'}}><FormattedMessage id="featured.header" defaultMessage="Featured decks"/></Header>
                <DeckList scope="featured"/>
            </Container>
        );
    }
}

export default Featured;
