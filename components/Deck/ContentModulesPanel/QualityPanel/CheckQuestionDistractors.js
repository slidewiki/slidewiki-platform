import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Accordion, Icon, Label, Message, List } from 'semantic-ui-react';

class CheckQuestionDistractors extends React.Component {
    constructor() {
        super();

        this.state = {
            errors: [],
        };
    }

    componentDidMount() {
        this.runValidation();
    }

    componentDidUpdate(prevProps) {
        if (this.props.ContentQuestionsStore !== prevProps.ContentQuestionsStore) {
            this.runValidation();
        }
    }

    runValidation = () => {
        const questions = this.props.ContentQuestionsStore.questions;
        let errors = [];

        if (questions && questions.length > 0) {
            for (const question of questions) {
                if (question.answers && question.answers.length < 2) {
                    errors.push({
                        question: question.title,
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
                    Deck question distractors available{' '}
                    <Label color={this.state.errors.length ? 'red' : 'green'} horizontal>
                        {this.state.errors.length ? this.state.errors.length + ' issues' : 'All good'}
                    </Label>
                </Accordion.Title>
                <Accordion.Content active={this.props.activeIndex === this.props.index}>
                    <Message color='blue'>
                        For multiple choice questions, distractor answers (i.e., wrong answers) should be provided to improve the question quality
                    </Message>
                    <List divided relaxed>
                        {this.state.errors.map((error, index) => (
                            <List.Item key={index}>
                                <List.Icon name='question' size='large' verticalAlign='middle' />
                                <List.Content>
                                    <List.Header>No distractors for: {error.question} </List.Header>
                                    <List.Description>No distractor answers found, please add additional answers</List.Description>
                                </List.Content>
                            </List.Item>
                        ))}
                    </List>
                </Accordion.Content>
            </>
        );
    }
}

CheckQuestionDistractors.contextTypes = {
    intl: PropTypes.object.isRequired,
};

CheckQuestionDistractors = connectToStores(CheckQuestionDistractors, [ContentQuestionsStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState(),
    };
});

export default CheckQuestionDistractors;
