import { connectToStores } from 'fluxible-addons-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, List, Message } from 'semantic-ui-react';
import QuestionAnsweringStore from '../../stores/QuestionAnsweringStore';
import { navigateAction } from 'fluxible-router';
import setDocumentTitle from '../../actions/setDocumentTitle';
import { defineMessages } from 'react-intl';

class QuestionAnswering extends React.Component {
    state = {
        question: '',
    };

    constructor(props) {
        super(props);
        this.recognition = null;

        this.boxRef = React.createRef();
        this.buttonRef = React.createRef();

        this.messages = defineMessages({
            enterQuestion: {
                id: 'QuestionAnswering.enterQuestion',
                defaultMessage: 'Enter a question',
            },
            findAnswer: {
                id: 'QuestionAnswering.findAnswer',
                defaultMessage: 'Find answer',
            },
            loading: {
                id: 'QuestionAnswering.loading',
                defaultMessage: 'Loading',
            },
            viewSlide: {
                id: 'QuestionAnswering.viewSlide',
                defaultMessage: 'View slide',
            },
            questionAnswering: {
                id: 'QuestionAnswering.questionAnswering',
                defaultMessage: 'Question answering',
            },
            answers: {
                id: 'QuestionAnswering.answers',
                defaultMessage: 'Answers',
            },
            error: {
                id: 'QuestionAnswering.error',
                defaultMessage: 'An error has occurred, please try it again (later)',
            },
        });
    }

    componentDidMount() {
        this.context.executeAction(setDocumentTitle, { title: this.context.intl.formatMessage(this.messages.answers) });

        this.setState({
            question: this.props.QuestionAnsweringStore.question,
        });
    }

    handleSearch = () => {
        this.context.executeAction(navigateAction, {
            url: `/question-answering?question=${encodeURIComponent(this.state.question)}`,
        });
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.handleSearch();
        }
    };

    render() {
        const { isLoading, answers, hasErrorOccurred } = this.props.QuestionAnsweringStore;
        return (
            <>
                <div className='ui container' style={{ minHeight: 300, position: 'relative' }}>
                    <h1 className='ui header' style={{ marginTop: '1em' }}>
                        {this.context.intl.formatMessage(this.messages.questionAnswering)}
                    </h1>
                    <form className='ui form success'>
                        <div className='field' role='search'>
                            <div className='ui search action fluid input'>
                                <input
                                    name='question'
                                    onChange={(e) => this.setState({ question: e.target.value })}
                                    onKeyPress={this.handleKeyPress}
                                    value={this.state.question}
                                    placeholder={this.context.intl.formatMessage(this.messages.enterQuestion)}
                                    type='text'
                                    className='prompt'
                                />
                                <div className='ui primary submit button' tabIndex='0' onClick={this.handleSearch} onKeyPress={this.handleSearch}>
                                    {this.context.intl.formatMessage(this.messages.findAnswer)}
                                </div>
                            </div>
                        </div>
                    </form>
                    {isLoading && <div className='ui active text loader'>{this.context.intl.formatMessage(this.messages.loading)}</div>}
                    {hasErrorOccurred && <Message color='red'>{this.context.intl.formatMessage(this.messages.error)}</Message>}
                    {answers.length > 0 && (
                        <>
                            <h2>{this.context.intl.formatMessage(this.messages.answers)}</h2>
                            <List celled style={{ marginBottom: 50 }}>
                                {answers.map((answer, index) => (
                                    <List.Item key={index} style={{ overflowWrap: 'break-word' }}>
                                        <List.Content floated='right' verticalAlign='middle'>
                                            <a href={['/deck', answer.deck_id, '-', 'slide', answer.slide_id + '-1'].join('/')} target='_blank'>
                                                <Button>{this.context.intl.formatMessage(this.messages.viewSlide)}</Button>
                                            </a>
                                        </List.Content>
                                        <List.Content verticalAlign='middle'>...{answer.answer}...</List.Content>
                                    </List.Item>
                                ))}
                            </List>
                        </>
                    )}
                </div>
            </>
        );
    }
}

QuestionAnswering.contextTypes = {
    intl: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired,
};

QuestionAnswering = connectToStores(QuestionAnswering, [QuestionAnsweringStore], (context, props) => {
    return {
        QuestionAnsweringStore: context.getStore(QuestionAnsweringStore).getState(),
    };
});

export default QuestionAnswering;
