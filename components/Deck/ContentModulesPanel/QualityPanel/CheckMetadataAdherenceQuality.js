import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import DeckViewStore from '../../../../stores/DeckViewStore';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Accordion, Icon, Label, Message, List } from 'semantic-ui-react';
import TranslationStore from '../../../../stores/TranslationStore';

class CheckMetadataAdherenceQuality extends React.Component {
    constructor() {
        super();

        this.state = {
            errors: [],
            score: 0
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

        let score = this.calculateAdherenceScore({
            title: deckData.title ? deckData.title : '',
            description: deckData.description ? deckData.description : '',
            subjects: deckData.topics ? deckData.topics.join(',') : '',
            level: deckData.educationLevel ? deckData.educationLevel : '',
            language: multipleLanguages,
            accessibilities: '',
            timeRequired: ''
        });

        this.setState({
            score
        });
    };

    calculateAdherenceScore = ({title, description, subjects, level, language, accessibilities, timeRequired}) => {
        let score = 0;

        score += this.calculateAdherenceScoreForField('title', title, this.titleImportance);
        score += this.calculateAdherenceScoreForField('description', description, this.descriptionImportance);
        score += this.calculateAdherenceScoreForField('subjects', subjects, this.subjectsImportance);
        score += this.calculateAdherenceScoreForField('level', level, this.levelImportance);
        score += this.calculateAdherenceScoreForField('language', language, this.languageImportance);
        score += this.calculateAdherenceScoreForField('accessibilities', accessibilities, this.accessibilitiesImportance);
        score += this.calculateAdherenceScoreForField('timeRequired', timeRequired, this.timeRequiredImportance);

        return Math.round(score * 100);
    }

    calculateAdherenceScoreForField = (field, fieldValue, fieldImportance) => {
        switch(field) {
            case 'title':
                return fieldValue !== null ? fieldImportance * 1/Math.ceil(Math.abs(fieldValue.split(' ').length-5.5)/2.5) : 0;
            case 'description':
                return fieldValue !== null ? fieldImportance * 1/Math.ceil(Math.abs(fieldValue.split(' ').length-54.5)/40) : 0;
            case 'subjects':
                return fieldValue !== null ? fieldImportance * 1/Math.ceil(Math.abs(fieldValue.split(',').length-4.5)/3.5) : 0;
            default:
                return fieldValue !== null ? fieldImportance : 0;
        }
    }

    render() {
        return (
            <>
                <Accordion.Title active={this.props.activeIndex === this.props.index} index={this.props.index} onClick={this.props.handleClick}>
                    <Icon name='dropdown' />
                    Adherence to Standardized Metadata{' '}
                    <Label color={'grey'} horizontal>
                        {this.state.score}%
                    </Label>
                </Accordion.Title>
                <Accordion.Content active={this.props.activeIndex === this.props.index}>
                    <Message color='blue'>This measures the quality of the provided metadata for this deck. The measured quality is {this.state.score}% out of 100%</Message>
                </Accordion.Content>
            </>
        );
    }
}

CheckMetadataAdherenceQuality.contextTypes = {
    intl: PropTypes.object.isRequired,
};

CheckMetadataAdherenceQuality = connectToStores(CheckMetadataAdherenceQuality, [DeckViewStore, TranslationStore], (context, props) => {
    return {
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        TranslationStore: context.getStore(TranslationStore).getState(),
    };
});

export default CheckMetadataAdherenceQuality;
