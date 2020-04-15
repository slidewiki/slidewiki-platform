import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import DeckViewStore from '../../../../stores/DeckViewStore';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Accordion, Icon, Label, Message, List } from 'semantic-ui-react';

class CheckHierarchicalDesign extends React.Component {
    constructor() {
        super();

        this.state = {
            title: null,
            description: null,
            subjects: null,
            level: null,
            language: null,
            accessibilities: null,
            timeRequired: null,

            titleImportance: 0.17,
            descriptionImportance: 0.17,
            subjectsImportance: 0.145,
            levelImportance: 0.165,
            languageImportance: 0.155,
            timeRequiredImportance: 0.098,
            accessibilitiesImportance: 0.099,

            error: false,
        };
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

        const availabilityScore = this.calculateAvailabilityScore(this.state.title,this.state.description,this.state.subjects,
            this.state.level, this.state.language, this.state.accessibilities, this.state.timeRequired);
        const adherenceScore = this.calculateAdherenceScore(this.state.title,this.state.description,this.state.subjects,
            this.state.level, this.state.language, this.state.accessibilities, this.state.timeRequired);


        const contentItems = this.props.DeckViewStore.deckData.contentItems;
        let foundDeck = false;

        if (contentItems && contentItems.length > 0) {
            for (const item of contentItems) {
                if (item.kind === 'deck') {
                    foundDeck = true;
                    break;
                }
            }
        }

        this.setState({
            error: !foundDeck,
        });
    };

    calculateAvailabilityScore = (title, description, subjects, level, language, accessibilities, timeRequired) => {
        score = 0;

        score += title !== null ? this.state.titleImportance : 0;
        score += description !== null ? this.state.descriptionImportance : 0;
        score += subjects !== null ? this.state.subjectsImportance : 0;
        score += level !== null ? this.state.levelImportance : 0;
        score += language !== null ? this.state.languageImportance : 0;
        score += accessibilities !== null ? this.state.accessibilitiesImportance : 0;
        score += timeRequired !== null ? this.state.timeRequiredImportance : 0;

        return score;
    }

    calculateAdherenceScore = (title, description, subjects, level, language, accessibilities, timeRequired) => {
        score = 0;

        score += this.calculateAdherenceScoreForField('title', title, this.state.titleImportance);
        score += this.calculateAdherenceScoreForField('description', description, this.state.descriptionImportance);
        score += this.calculateAdherenceScoreForField('subjects', subjects, this.state.subjectsImportance);
        score += this.calculateAdherenceScoreForField('level', level, this.state.levelImportance);
        score += this.calculateAdherenceScoreForField('language', language, this.state.languageImportance);
        score += this.calculateAdherenceScoreForField('accessibilities', accessibilities, this.state.accessibilitiesImportance);
        score += this.calculateAdherenceScoreForField('timeRequired', timeRequired, this.state.timeRequiredImportance);

        return score;
    }

    calculateAdherenceScoreForField = (field, fieldValue, fieldImportance) => {
        switch(field) {
            case 'title':
                return fieldValue !== null ? fieldImportance * 1/Math.ceil(Math.abs(fieldValue.split(' ').length-5.5/2.5)) : 0;
            case 'description':
                return fieldValue !== null ? fieldImportance * 1/Math.ceil(Math.abs(fieldValue.split(' ').length-54.5/40)) : 0;
            case 'subjects':
                return fieldValue !== null ? fieldImportance * 1/Math.ceil(Math.abs(fieldValue.split(',').length-4.5/3.5)) : 0;
            default:
                return fieldValue !== null ? fieldImportance : 0;
        }
        return title;
    }

    render() {
        return (
            <>
                <Accordion.Title active={this.props.activeIndex === this.props.index} index={this.props.index} onClick={this.props.handleClick}>
                    <Icon name='dropdown' />
                    Hierarchical design{' '}
                    <Label color={this.state.error ? 'red' : 'green'} horizontal>
                        {this.state.error ? '1 issue' : 'All good'}
                    </Label>
                </Accordion.Title>
                <Accordion.Content active={this.props.activeIndex === this.props.index}>
                    <Message color='blue'>It is good practice to use subdecks to create a hierarchy in the slide structure</Message>
                    <List divided relaxed>
                        {this.state.error && <Message color='red'>No subdecks found, add a subdeck to improve the slide structure</Message>}
                    </List>
                </Accordion.Content>
            </>
        );
    }
}

CheckHierarchicalDesign.contextTypes = {
    intl: PropTypes.object.isRequired,
};

CheckHierarchicalDesign = connectToStores(CheckHierarchicalDesign, [DeckViewStore], (context, props) => {
    return {
        DeckViewStore: context.getStore(DeckViewStore).getState(),
    };
});

export default CheckHierarchicalDesign;
