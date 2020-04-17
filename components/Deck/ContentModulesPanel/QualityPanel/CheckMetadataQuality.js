import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import DeckViewStore from '../../../../stores/DeckViewStore';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Accordion, Icon, Label, Message, List } from 'semantic-ui-react';
import TranslationStore from '../../../../stores/TranslationStore';

class CheckMetadataQuality extends React.Component {
    constructor() {
        super();

        this.state = {
            errors: [],
            score: 0,
        };

        this.titleImportance = 0.17;
        this.descriptionImportance = 0.17;
        this.subjectsImportance = 0.145;
        this.levelImportance = 0.165;
        this.languageImportance = 0.155;
        this.timeRequiredImportance = 0.098;
        this.accessibilitiesImportance = 0.099;
    }

    componentDidMount() {
        this.runValidation();
    }

    componentDidUpdate(prevProps) {
        if (this.props.DeckViewStore !== prevProps.DeckViewStore) {
            this.runValidation();
        }
    }

    runValidation = () => {
        let { deckData } = this.props.DeckViewStore;
        const translations = this.props.TranslationStore.treeTranslations;
        const multipleLanguages = translations && translations.length > 0;
        let errors = [];

        if (!deckData.title) {
            errors.push('Deck does not have a title');
        }

        if (!deckData.description) {
            errors.push('Deck does not have a description');
        }

        if (!deckData.topics || deckData.topics.length === 0) {
            errors.push('No subjects are specified for this deck');
        }

        if (!deckData.educationLevel) {
            errors.push('The educational level of the deck is not specified');
        }

        if (!multipleLanguages) {
            errors.push('The deck is only available in one language');
        }

        let score = this.calculateAvailabilityScore({
            title: deckData.title,
            description: deckData.description,
            subjects: deckData.topics ? deckData.topics.length : '',
            level: deckData.educationLevel,
            language: multipleLanguages
        });


        this.setState({
            errors,
            score
        });
    };

    calculateAvailabilityScore = ({title, description, subjects, level, language, accessibilities, timeRequired}) => {
        let score = 0;

        score += (title != 0 && title !== undefined) ? this.titleImportance : 0;
        score += (description != 0 && description !== undefined) ? this.descriptionImportance : 0;
        score += (subjects != 0 && subjects !== undefined) ? this.subjectsImportance : 0;
        score += (level != 0 && level !== undefined) ? this.levelImportance : 0;
        score += (language != 0 && language !== undefined) ? this.languageImportance : 0;
        score += (accessibilities != 0 && accessibilities !== undefined) ? this.accessibilitiesImportance : 0;
        score += (timeRequired != 0 && timeRequired !== undefined) ? this.timeRequiredImportance : 0;

        return Math.round(score * 100);
    }

    render() {
        return (
            <>
                <Accordion.Title active={this.props.activeIndex === this.props.index} index={this.props.index} onClick={this.props.handleClick}>
                    <Icon name='dropdown' />
                    Availability of Standardized Metadata{' '}
                    <Label color={this.state.errors.length > 0 ? 'red' : 'green'} horizontal>
                        {this.state.errors.length > 0 ? this.state.errors.length + ' issues' : 'All good'}
                    </Label>
                    {' '}
                    <Label color={'grey'} horizontal>
                        {this.state.score}%
                    </Label>
                </Accordion.Title>
                <Accordion.Content active={this.props.activeIndex === this.props.index}>
                    <Message color='blue'>The availability of metadata helps users to find decks and to understand the contents. The measured quality is {this.state.score}% out of 100%</Message>
                    <List divided relaxed>
                        {this.state.errors.map((error, index) => (
                            <Message color='red' key={index}>{error}</Message>
                        ))}
                    </List>
                </Accordion.Content>
            </>
        );
    }
}

CheckMetadataQuality.contextTypes = {
    intl: PropTypes.object.isRequired,
};

CheckMetadataQuality = connectToStores(CheckMetadataQuality, [DeckViewStore, TranslationStore], (context, props) => {
    return {
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        TranslationStore: context.getStore(TranslationStore).getState(),
    };
});

export default CheckMetadataQuality;
