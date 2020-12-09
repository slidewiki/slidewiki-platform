import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import { Button, Icon, Ref, Message } from 'semantic-ui-react';
import styled from 'styled-components';
import { match } from 'path-to-regexp';
import { pickBy, upperFirst, shuffle } from 'lodash';
import routes from '../../../configs/routes';
import { defineMessages } from 'react-intl';

const Popover = styled.div`
    width: 350px;
    min-height: 300px;
    position: absolute;
    box-shadow: 0 0 2px 2px #00000054;
    z-index: 3;
    right: 0;
    top: 52px;
    background: #fff;
    border-radius: 4px;
    color: #000;
`;

const SpeechArea = styled.div`
    background: #e3e0e0;
    min-height: 80px;
    font-size: 20px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: #000;
    border-radius: 4px 4px 0 0;
    font-weight: bold;
`;

const WhatCanISay = styled.div`
    padding: 30px 15px;
`;

const Label = styled.h1`
    font-size: 20px;
`;

const SuggestionsList = styled.ul`
    li {
        padding-bottom: 5px;
        line-height: 1.5;
    }
`;

const ButtonMicrophone = styled(Button)`
    background: #5997cc !important;
    color: #fff !important;

    &.ui.button:focus {
        box-shadow: 0 0 0 2px #000 !important;
    }
`;

// TOOD: refactor into multiple files (preferably with hooks)
class SpeechInterface extends React.Component {
    state = {
        showPopover: false,
        transcript: null,
        whatCanIAsk: [],
        limit: 3,
    };

    constructor(props) {
        super(props);
        this.recognition = null;

        this.boxRef = React.createRef();
        this.buttonRef = React.createRef();

        this.messages = defineMessages({
            openSlideshowListenTo1: {
                id: 'SpeechInterface.command.openSlideshowListenTo1',
                defaultMessage: 'open this as slideshow',
            },
            openSlideshowListenTo2: {
                id: 'SpeechInterface.command.openSlideshowListenTo2',
                defaultMessage: 'open as slideshow',
            },
            openSlideshowListenTo3: {
                id: 'SpeechInterface.command.openSlideshowListenTo3',
                defaultMessage: 'open deck as slideshow',
            },
            openSlideshowAnswer: {
                id: 'SpeechInterface.command.openSlideshowAnswer',
                defaultMessage: 'the slideshow is opened in a new tab',
            },
            lastSlide: {
                id: 'SpeechInterface.command.lastSlide',
                defaultMessage: 'last slide',
            },
            firstSlide: {
                id: 'SpeechInterface.command.firstSlide',
                defaultMessage: 'first slide',
            },
            previousSlide: {
                id: 'SpeechInterface.command.previousSlide',
                defaultMessage: 'previous slide',
            },
            nextSlide: {
                id: 'SpeechInterface.command.nextSlide',
                defaultMessage: 'next slide',
            },
            likeDeckListenTo1: {
                id: 'SpeechInterface.command.likeDeckListenTo1',
                defaultMessage: 'like deck',
            },
            likeDeckListenTo2: {
                id: 'SpeechInterface.command.likeDeckListenTo2',
                defaultMessage: 'like this deck',
            },
            likeDeckAnswer: {
                id: 'SpeechInterface.command.likeDeckAnswer',
                defaultMessage: 'you liked this deck',
            },
            editDeckListenTo1: {
                id: 'SpeechInterface.command.editDeckListenTo1',
                defaultMessage: 'edit this deck',
            },
            editDeckListenTo2: {
                id: 'SpeechInterface.command.editDeckListenTo2',
                defaultMessage: 'edit deck settings',
            },
            editDeckAnswer: {
                id: 'SpeechInterface.command.editDeckAnswer',
                defaultMessage: 'you can now edit the deck settings',
            },
            addDeckListenTo1: {
                id: 'SpeechInterface.command.addDeckListenTo1',
                defaultMessage: 'add a new deck',
            },
            addDeckListenTo2: {
                id: 'SpeechInterface.command.addDeckListenTo2',
                defaultMessage: 'create a new deck',
            },
            addDeckListenTo3: {
                id: 'SpeechInterface.command.addDeckListenTo3',
                defaultMessage: 'add deck',
            },
            addDeckAnswer: {
                id: 'SpeechInterface.command.addDeckAnswer',
                defaultMessage: 'you can now create a new deck',
            },
            navigateToListenTo: {
                id: 'SpeechInterface.command.navigateToListenTo',
                defaultMessage: 'navigate to',
            },
            navigateToAnswer: {
                id: 'SpeechInterface.command.navigateToAnswer',
                defaultMessage: 'navigating to requested page',
            },
            navigateToExample: {
                id: 'SpeechInterface.command.navigateToExample',
                defaultMessage: 'Navigate to [home/about us/etc.]',
            },
            searchListenTo: {
                id: 'SpeechInterface.command.searchListenTo',
                defaultMessage: 'search for',
            },
            searchAnswer: {
                id: 'SpeechInterface.command.searchAnswer',
                defaultMessage: 'searching for decks',
            },
            searchExample: {
                id: 'SpeechInterface.command.searchExample',
                defaultMessage: 'Search for RDF',
            },
            actionCannotBePerformed: {
                id: 'SpeechInterface.actionCannotBePerformed',
                defaultMessage: 'Action could not be performed. Maybe you need to be authenticated or you don\'t have the right permissions',
            },
            notFound: {
                id: 'SpeechInterface.notFound',
                defaultMessage: 'I did not understand what you want. Please try again',
            },
            listening: {
                id: 'SpeechInterface.listening',
                defaultMessage: 'I\'m listening...',
            },
            ariaSpeechInterface: {
                id: 'SpeechInterface.ariaSpeechInterface',
                defaultMessage: 'Open speech commands interface',
            },
            whatCanIAsk: {
                id: 'SpeechInterface.whatCanIAsk',
                defaultMessage: 'What can I ask?',
            },
            more: {
                id: 'SpeechInterface.more',
                defaultMessage: 'More',
            },
            questionAnswerListenTo: {
                id: 'SpeechInterface.command.questionAnswerListenTo',
                defaultMessage: 'question',
            },
            questionAnswerAnswer: {
                id: 'SpeechInterface.command.questionAnswerAnswer',
                defaultMessage: 'finding answers to your question',
            },
            questionAnswerExample: {
                id: 'SpeechInterface.command.questionAnswerExample',
                defaultMessage: 'Question: what is accessibility?',
            },
            browserWarning: {
                id: 'SpeechInterface.command.browserWarning',
                defaultMessage: 'The speech interface currently only works in the Google Chrome browser',
            },
        });
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('keydown', this.handleEscape, false);
        this.commands = this.getSpeechCommands();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('keydown', this.handleEscape, false);
    }

    componentDidUpdate() {
        if (typeof window !== 'undefined') {
            if (!this.isChromeBrowser()) {
                return;
            }
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.lang = this.getRecognitionLanguage();
                this.recognition.continuous = true;
                this.recognition.interimResults = false;
            }
        }
    }
    isChromeBrowser = () => {
        return typeof window !== 'undefined' && window.navigator ? window.navigator.userAgent.indexOf('Chrome') !== -1 : null;
    };
    getRecognitionLanguage = () => {
        const { locale } = this.context.intl;
        if (locale === 'en') {
            return 'en-US';
        }
        if (locale === 'de') {
            return 'de-DE';
        }
        if (locale === 'fr') {
            return 'fr-FR';
        }
        if (locale === 'it') {
            return 'it-IT';
        }
        if (locale === 'es') {
            return 'es-ES';
        }
        if (locale === 'nl') {
            return 'nl-NL';
        }
        if (locale === 'pt') {
            return 'pt-PT';
        }
        if (locale === 'el') {
            return 'el-GR';
        }
        if (locale === 'sr') {
            return 'sr-SP';
        }
    };

    getSpeechCommands = () => {
        return {
            openSlideshow: {
                type: 'action',
                event: 'click',
                targetId: 'openSlideshow',
                listenTo: [
                    this.context.intl.formatMessage(this.messages.openSlideshowListenTo1),
                    this.context.intl.formatMessage(this.messages.openSlideshowListenTo2),
                    this.context.intl.formatMessage(this.messages.openSlideshowListenTo3),
                ],
                answer: this.context.intl.formatMessage(this.messages.openSlideshowAnswer),
                pages: [routes.deck.path],
            },
            lastSlide: {
                type: 'action',
                event: 'click',
                targetId: 'lastSlide',
                listenTo: [this.context.intl.formatMessage(this.messages.lastSlide)],
                answer: this.context.intl.formatMessage(this.messages.lastSlide),
                pages: [routes.deck.path],
            },
            firstSlide: {
                type: 'action',
                event: 'click',
                targetId: 'firstSlide',
                listenTo: [this.context.intl.formatMessage(this.messages.firstSlide)],
                answer: this.context.intl.formatMessage(this.messages.firstSlide),
                pages: [routes.deck.path],
            },
            previousSlide: {
                type: 'action',
                event: 'click',
                targetId: 'previousSlide',
                listenTo: [this.context.intl.formatMessage(this.messages.previousSlide)],
                answer: this.context.intl.formatMessage(this.messages.previousSlide),
                pages: [routes.deck.path],
            },
            nextSlide: {
                type: 'action',
                event: 'click',
                targetId: 'nextSlide',
                listenTo: [this.context.intl.formatMessage(this.messages.nextSlide)],
                answer: this.context.intl.formatMessage(this.messages.nextSlide),
                pages: [routes.deck.path],
            },
            likeDeck: {
                type: 'action',
                event: 'click',
                targetId: 'likeDeck',
                listenTo: [
                    this.context.intl.formatMessage(this.messages.likeDeckListenTo1),
                    this.context.intl.formatMessage(this.messages.likeDeckListenTo2),
                ],
                answer: this.context.intl.formatMessage(this.messages.likeDeckAnswer),
                pages: [routes.deck.path],
            },
            editDeckSettings: {
                type: 'action',
                event: 'click',
                targetId: 'editDeckSettings',
                listenTo: [
                    this.context.intl.formatMessage(this.messages.editDeckListenTo1),
                    this.context.intl.formatMessage(this.messages.editDeckListenTo2),
                ],
                answer: this.context.intl.formatMessage(this.messages.editDeckAnswer),
                pages: [routes.deck.path],
            },
            addDeck: {
                type: 'navigation',
                listenTo: [
                    this.context.intl.formatMessage(this.messages.addDeckListenTo1),
                    this.context.intl.formatMessage(this.messages.addDeckListenTo2),
                    this.context.intl.formatMessage(this.messages.addDeckListenTo3),
                ],
                navigateTo: '/addDeck',
                answer: this.context.intl.formatMessage(this.messages.addDeckAnswer),
                pages: ['*'],
            },
            navigateTo: {
                type: 'navigation',
                listenTo: [
                    this.context.intl.formatMessage(this.messages.navigateToListenTo), //[page]
                ],
                navigateTo: null,
                params: {
                    // TODO: add more pages
                    page: [
                        {
                            name: 'home',
                            path: '/',
                        },
                        {
                            name: 'about us',
                            path: '/about',
                        },
                        {
                            name: 'contact us',
                            path: '/contactus',
                        },
                    ],
                },
                answer: this.context.intl.formatMessage(this.messages.navigateToAnswer),
                pages: ['*'],
                example: this.context.intl.formatMessage(this.messages.navigateToExample),
            },
            searchFor: {
                type: 'navigation',
                listenTo: [
                    this.context.intl.formatMessage(this.messages.searchListenTo), //[page]
                ],
                navigateTo: '/search?keywords=[param]&sort=score',
                answer: this.context.intl.formatMessage(this.messages.searchAnswer),
                pages: ['*'],
                example: this.context.intl.formatMessage(this.messages.searchExample),
            },
            questionAnswering: {
                type: 'navigation',
                listenTo: [this.context.intl.formatMessage(this.messages.questionAnswerListenTo)],
                navigateTo: '/question-answering?question=[param]',
                answer: this.context.intl.formatMessage(this.messages.questionAnswerAnswer),
                pages: ['*'],
                example: this.context.intl.formatMessage(this.messages.questionAnswerExample),
            },
        };
    };

    handleEscape = (event) => {
        if (!event.keyCode === 27) {
            return;
        }
        this.closePopover();
    };

    handleClickOutside = (event) => {
        if (
            this.boxRef &&
            this.boxRef.current &&
            !this.boxRef.current.contains(event.target) &&
            this.buttonRef &&
            !this.buttonRef.current.ref.current.contains(event.target)
        ) {
            this.closePopover();
        }
    };

    closePopover = () => {
        this.setState({
            showPopover: false,
        });
        if (this.recognition) {
            this.recognition.abort();
        }
    };

    togglePopover = () => {
        const isOpen = this.state.showPopover;

        this.setState((prevState) => ({
            showPopover: !prevState.showPopover,
        }));

        if (!isOpen) {
            // filter out commands that are not allowed on the current page
            const commandsFiltered = pickBy(this.commands, (command) => {
                if (command.pages.includes('*')) {
                    return true;
                }

                for (const page of command.pages) {
                    const matchViewPaper = match(page);
                    if (matchViewPaper(window.location.pathname)) {
                        return true;
                    }
                }
            });

            let whatCanIAsk = [];

            for (let commandName in commandsFiltered) {
                const command = this.commands[commandName];
                const exampleCommand = command.example ?? command.listenTo[0];
                whatCanIAsk.push(exampleCommand);
            }

            whatCanIAsk = shuffle(whatCanIAsk);

            this.setState({
                whatCanIAsk,
                limit: 3, //reset limit
            });

            if (this.recognition) {
                this.recognition.onresult = (event) => {
                    if (typeof event.results === 'undefined') {
                        return;
                    }
                    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();

                    this.setState({
                        transcript,
                    });

                    let commandExecuted = false;

                    for (let commandName in commandsFiltered) {
                        const command = this.commands[commandName];
                        const { listenTo, type, targetId, event, answer, params, navigateTo } = command;

                        for (const _listenTo of listenTo) {
                            if (transcript.indexOf(_listenTo) === 0) {
                                // param could be used with something like: allowParams, if false, it should be empty
                                const param =
                                    transcript[_listenTo.length] !== undefined
                                        ? transcript.substring(_listenTo.length, transcript.length).trim()
                                        : null;

                                if (type === 'action') {
                                    const targetElement = document.querySelector(`[data-speech-id=${targetId}]`);
                                    commandExecuted = true;

                                    if (targetElement) {
                                        targetElement.click();
                                    } else {
                                        this.speechSynthesis(this.context.intl.formatMessage(this.messages.actionCannotBePerformed));
                                        return;
                                    }
                                } else if (type === 'navigation') {
                                    commandExecuted = true;

                                    if (!navigateTo) {
                                        for (const page of params.page) {
                                            if (page.name === param) {
                                                window.location.href = page.path;
                                            }
                                        }
                                    } else {
                                        const href = navigateTo.replace('[param]', param);
                                        window.location.href = href;
                                    }
                                }

                                if (answer) {
                                    this.speechSynthesis(answer);
                                }
                            }
                        }
                    }

                    if (!commandExecuted) {
                        this.speechSynthesis(this.context.intl.formatMessage(this.messages.notFound));
                    } else {
                        this.setState({
                            showPopover: false,
                        });
                    }
                };

                this.recognition.start();
            }
        } else {
            if (this.recognition) {
                this.recognition.abort();
            }
        }
    };

    speechSynthesis = (answer) => {
        const answerSpeech = new SpeechSynthesisUtterance(answer);
        window.speechSynthesis.speak(answerSpeech);
    };

    handleMore = () => {
        this.setState((prevState) => ({
            limit: prevState.limit + 5,
        }));
    };

    render() {
        return (
            <div className='item' style={{ position: 'relative' }}>
                <Ref innerRef={this.buttonRef}>
                    <ButtonMicrophone
                        icon
                        onClick={this.togglePopover}
                        aria-label={this.context.intl.formatMessage(this.messages.ariaSpeechInterface)}
                    >
                        <Icon name='microphone' />
                    </ButtonMicrophone>
                </Ref>

                {this.state.showPopover && (
                    <Popover ref={this.boxRef}>
                        {this.isChromeBrowser() === false && (
                            <Message error style={{ margin: 10 }} role='alert'>
                                {this.context.intl.formatMessage(this.messages.browserWarning)}
                            </Message>
                        )}
                        <SpeechArea>
                            {this.state.transcript ? this.state.transcript : this.context.intl.formatMessage(this.messages.listening)}
                        </SpeechArea>
                        <WhatCanISay>
                            <Label>{this.context.intl.formatMessage(this.messages.whatCanIAsk)}</Label>
                            <SuggestionsList>
                                {this.state.whatCanIAsk.map((command, index) => {
                                    if (index > this.state.limit) {
                                        return null;
                                    }
                                    return <li key={index}>{upperFirst(command)}</li>;
                                })}
                            </SuggestionsList>
                            {this.state.limit < this.state.whatCanIAsk.length - 1 && (
                                <Button onClick={this.handleMore}>{this.context.intl.formatMessage(this.messages.more)}</Button>
                            )}
                        </WhatCanISay>
                    </Popover>
                )}
            </div>
        );
    }
}

SpeechInterface.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func,
    intl: PropTypes.object.isRequired,
};

SpeechInterface = connectToStores(SpeechInterface, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
    };
});

export default SpeechInterface;
