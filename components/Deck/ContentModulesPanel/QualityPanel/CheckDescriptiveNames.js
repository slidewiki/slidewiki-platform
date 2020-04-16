import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import DeckViewStore from '../../../../stores/DeckViewStore';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Accordion, Icon, Label, Message, List } from 'semantic-ui-react';

class CheckDescriptiveNames extends React.Component {
    constructor() {
        super();

        this.state = {
            errors: [],
        };

        this.maxWords = 10;
        this.minWords = 3;
        this.maxLength = 50;
    }

    componentDidMount() {
        this.runValidation();
    }

    // rerun the validation when the decks are updated
    componentDidUpdate(prevProps) {
        if (this.props.DeckViewStore !== prevProps.DeckViewStore) {
            this.runValidation();
        }
    }

    validateTitle = (title) => {
        if (!title) {
            return false;
        }
        const wordsAmount = title.split(' ').length;

        // check the amount of words in the title
        if (wordsAmount < this.minWords || wordsAmount > this.maxWords) {
            return false;
        }

        // check the amount of characters
        if (wordsAmount.length > this.maxLength) {
            return false;
        }

        return true;
    };

    runValidation = () => {
        const deckTitle = this.props.DeckViewStore.deckData.title;
        let errors = [];

        if (!this.validateTitle(deckTitle)) {
            errors.push({
                title: 'Deck title: ' + deckTitle,
                description: 'Deck title is not descriptive, change the name',
            });
        }

        const slides = this.props.DeckViewStore.slidesData.children;

        if (slides && slides.length > 0) {
            for (const slide of slides) {
                if (!this.validateTitle(slide.title)) {
                    errors.push({
                        title: 'Slide title: ' + slide.title,
                        description: 'Slide name is not descriptive, change the name',
                    });
                }
            }    
        }

        
        this.setState({
            errors,
        });
    };

    render() {
        return (
            <>
                <Accordion.Title active={this.props.activeIndex === this.props.index} index={this.props.index} onClick={this.props.handleClick}>
                    <Icon name='dropdown' />
                    Short and descriptive names{' '}
                    <Label color={this.state.errors.length > 0 ? 'red' : 'green'} horizontal>
                        {this.state.errors.length > 0 ? this.state.errors.length + ' issues' : 'All good'}
                    </Label>
                </Accordion.Title>
                <Accordion.Content active={this.props.activeIndex === this.props.index}>
                    <Message color='blue'>Both the deck name and slide names should be short and descriptive</Message>
                    <List divided relaxed>
                        {this.state.errors.map((error, index) => (
                            <List.Item key={index}>
                                <List.Icon name='file' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>{error.title}</List.Header>
                                    <List.Description>{error.description}</List.Description>
                                </List.Content>
                            </List.Item>
                        ))}
                    </List>
                </Accordion.Content>
            </>
        );
    }
}

CheckDescriptiveNames.contextTypes = {
    intl: PropTypes.object.isRequired,
};

CheckDescriptiveNames = connectToStores(CheckDescriptiveNames, [DeckViewStore], (context, props) => {
    return {
        DeckViewStore: context.getStore(DeckViewStore).getState(),
    };
});

export default CheckDescriptiveNames;
