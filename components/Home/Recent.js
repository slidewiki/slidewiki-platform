import React from 'react';
import DeckList from './DeckList';
import {Container, Header} from 'semantic-ui-react';
import { FormattedMessage, defineMessages} from 'react-intl';
import setDocumentTitle from '../../actions/setDocumentTitle';
import PropTypes from 'prop-types';

class Recent extends React.Component {
    constructor(props) {
        super(props);

        this.messages = defineMessages({
            title: {
                id: 'recent.title',
                defaultMessage: 'Recent Decks'
            }
        });
    }

    componentDidMount() {
        this.context.executeAction(setDocumentTitle, { 
            title: this.context.intl.formatMessage({
                id: 'recent.title',
                defaultMessage: 'Recent Decks'
            }) 
        });
    }

    render() {
        return (
            <Container>
                <Header as="h1" id="main" style={{marginTop: '1em'}}><FormattedMessage id="recent.header" defaultMessage="Recent decks added by users"/></Header>
                <DeckList scope="recent"/>
            </Container>
        );
    }
}

Recent.contextTypes = {
    intl: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired
};


export default Recent;
