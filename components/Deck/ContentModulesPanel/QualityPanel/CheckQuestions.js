import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Accordion, Icon, Label, Message, List } from 'semantic-ui-react';

class CheckQuestions extends React.Component {
    constructor() {
        super();

        this.state = {
            error: false,
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
        let foundQuestions = false;

        if (questions && questions.length > 0) {
            foundQuestions = true;
        }

        this.setState({
            error: !foundQuestions,
        });
    };

    render() {
        return (
            <>
                <Accordion.Title active={this.props.activeIndex === this.props.index} index={this.props.index} onClick={this.props.handleClick}>
                    <Icon name='dropdown' />
                    Deck questions are available{' '}
                    <Label color={this.state.error ? 'red' : 'green'} horizontal>
                        {this.state.error ? '1 issue' : 'All good'}
                    </Label>
                </Accordion.Title>
                <Accordion.Content active={this.props.activeIndex === this.props.index}>
                    <Message color='blue'>In order for learners to test their understanding of the content, self-assessment are helpful</Message>
                    <List divided relaxed>
                        {this.state.error && (
                            <Message color='red'>No self-assessment questions found, please add questions</Message>
                        )}
                    </List>
                </Accordion.Content>
            </>
        );
    }
}

CheckQuestions.contextTypes = {
    intl: PropTypes.object.isRequired,
};

CheckQuestions = connectToStores(CheckQuestions, [ContentQuestionsStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState(),
    };
});

export default CheckQuestions;
