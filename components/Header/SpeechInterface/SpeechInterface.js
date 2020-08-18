import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import { Button, Icon, Ref } from 'semantic-ui-react';
import styled from 'styled-components';
import commands from './commands';
import { match } from 'path-to-regexp';
import { pickBy, upperFirst, shuffle } from 'lodash';

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

const Label = styled.div`
    font-size: 20px;
`;

const SuggestionsList = styled.ul`
    li {
        padding-bottom: 5px;
    }
`;

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
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate() {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.lang = 'en-US';
                this.recognition.continuous = true;
                this.recognition.interimResults = false;
            }
        }
    }

    handleClickOutside = (event) => {
        if (this.boxRef && !this.boxRef.current.contains(event.target) && this.buttonRef && !this.buttonRef.current.contains(event.target)) {
            this.closePopover();
        }
    };

    closePopover = () => {
        this.setState({
            showPopover: false,
        });
        this.recognition.abort();
    };

    togglePopover = () => {
        const isOpen = this.state.showPopover;

        this.setState((prevState) => ({
            showPopover: !prevState.showPopover,
        }));

        if (!isOpen) {
            // filter out commands that are not allowed on the current page
            const commandsFiltered = pickBy(commands, (command) => {
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
                const command = commands[commandName];
                const exampleCommand = command.example ?? command.listenTo[0];
                whatCanIAsk.push(exampleCommand);
            }

            whatCanIAsk = shuffle(whatCanIAsk);

            this.setState({
                whatCanIAsk,
                limit: 3, //reset limit
            });

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
                    const command = commands[commandName];
                    const { listenTo, type, targetId, event, answer, params, navigateTo } = command;

                    for (const _listenTo of listenTo) {
                        console.log('transcript', transcript);
                        if (transcript.indexOf(_listenTo) === 0) {
                            // param could be used with something like: allowParams, if false, it should be empty
                            const param =
                                transcript[_listenTo.length] !== undefined ? transcript.substring(_listenTo.length, transcript.length).trim() : null;

                            if (type === 'action') {
                                const targetElement = document.querySelector(`[data-speech-id=${targetId}]`);
                                commandExecuted = true;

                                if (targetElement) {
                                    targetElement.click();
                                } else {
                                    this.speechSynthesis(
                                        "Action could not be performed. Maybe you need to be authenticated or you don't have the right permissions"
                                    );
                                    return;
                                }
                            } else if (type === 'navigation') {
                                console.log(navigateTo);
                                commandExecuted = true;

                                if (!navigateTo) {
                                    for (const page of params.page) {
                                        console.log(page);
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
                    this.speechSynthesis('I did not understand what you want. Please try again');
                } else {
                    this.setState({
                        showPopover: false,
                    });
                }
            };

            this.recognition.start();
        } else {
            this.recognition.abort();
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
            <div style={{ position: 'relative' }}>
                <div className='item'>
                    <Ref innerRef={this.buttonRef}>
                        <Button icon style={{ background: '#5997CC', color: '#fff' }} onClick={this.togglePopover}>
                            <Icon name='microphone' />
                        </Button>
                    </Ref>
                </div>

                <Popover style={{ display: this.state.showPopover ? 'block' : 'none' }} ref={this.boxRef}>
                    <SpeechArea>{this.state.transcript ? this.state.transcript : "I'm listening..."}</SpeechArea>
                    <WhatCanISay>
                        <Label>What can I ask?</Label>
                        <SuggestionsList>
                            {this.state.whatCanIAsk.map((command, index) => {
                                if (index > this.state.limit) {
                                    return null;
                                }
                                return <li key={index}>{upperFirst(command)}</li>;
                            })}
                        </SuggestionsList>
                        {this.state.limit < this.state.whatCanIAsk.length && <Button onClick={this.handleMore}>More...</Button>}
                    </WhatCanISay>
                </Popover>
            </div>
        );
    }
}

SpeechInterface.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getUser: PropTypes.func,
};

SpeechInterface = connectToStores(SpeechInterface, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
    };
});

export default SpeechInterface;
