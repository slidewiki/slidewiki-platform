import PropTypes from 'prop-types';
import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import { Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import commands from './commands';
import $ from 'jquery';
import { match } from 'path-to-regexp';

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
    };

    constructor(props) {
        super(props);
        this.recognition = null;
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

    listenToVoice = () => {};

    togglePopover = () => {
        const isOpen = this.state.showPopover;

        this.setState((prevState) => ({
            showPopover: !prevState.showPopover,
        }));
        console.log(this.props);

        if (!isOpen) {
            //this.recognition.onresult = (event) => {
            setTimeout(() => {
                /*if (typeof event.results === 'undefined') {
                    return;
                }
                const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();*/
                const transcript = 'open deck as slideshow';
                this.setState({
                    transcript,
                });

                for (let commandName in commands) {
                    const command = commands[commandName];
                    const { listenTo, type, targetId, event, answer, params, navigateTo } = command;
                    console.log('TEST!!!!!!!!!!');
                    for (const _listenTo of listenTo) {
                        if (transcript.indexOf(_listenTo) === 0) {
                            // param could be used with something like: allowParams, if false, it should be empty
                            const param =
                                transcript[_listenTo.length] !== undefined ? transcript.substring(_listenTo.length, transcript.length).trim() : null;
                            console.log('execute ', command.type, ' with param ', param);
                            console.log('window.location.href', window.location.pathname);
                            const matchViewPaper = match('/deck/:id(\\d+|\\d+-\\d+):slug(/[^/]+)?');
                            console.log('matchViewPaper', matchViewPaper(window.location.pathname));
                            if (type === 'action') {
                                const targetElement = $(`[data-speech-id=${targetId}]`);

                                if (targetElement.length) {
                                    targetElement.trigger(event);
                                } else {
                                    this.speechSynthesis(
                                        'Action could not be performed. Maybe you need to be authenticated or you don\'t have the right permissions'
                                    );
                                    return;
                                }
                                console.log('trigger', $(`[data-speech-id=${targetId}]`));
                            } else if (type === 'navigation') {
                                console.log(navigateTo);
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

                            //}

                            if (answer) {
                                this.speechSynthesis(answer);
                            }
                        }
                    }
                }
            }, 1000);

            this.recognition.start();
        } else {
            this.recognition.abort();
        }
    };

    speechSynthesis = (answer) => {
        const answerSpeech = new SpeechSynthesisUtterance(answer);
        window.speechSynthesis.speak(answerSpeech);
    };

    render() {
        return (
            <div style={{ position: 'relative' }}>
                <div className='item'>
                    <Button icon style={{ background: '#5997CC', color: '#fff' }} onClick={this.togglePopover}>
                        <Icon name='microphone' />
                    </Button>
                </div>

                <Popover style={{ display: this.state.showPopover ? 'block' : 'none' }}>
                    <SpeechArea>{this.state.transcript ? this.state.transcript : "I'm listening..."}</SpeechArea>
                    <WhatCanISay>
                        <Label>What can I ask?</Label>
                        <SuggestionsList>
                            <li>Go to page [home/add deck etc.]</li>
                            <li>Search for decks related to …</li>
                            <li>Open sign in dialog</li>
                        </SuggestionsList>

                        <Button>More...</Button>
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
