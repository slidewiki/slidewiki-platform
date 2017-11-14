import React from 'react';
import { Input, Button, Label } from 'semantic-ui-react';
import ISO6391 from 'iso-639-1';

class SpeechRecognition extends React.Component {

/*
  Props:
    isInitiator - var
    sendRTCMessage - func
    showInviteModal - func
    subtitle - var
*/

    constructor(props) {
        super(props);

        this.state={
            speechRecognitionDisabled: false,
            subtitle: ''
        };

        this.recognition = undefined;
    }

    getSubtitle() {
        return this.state.subtitle;
    }

    componentDidUpdate() {
        $('#input_subtitle').animate({
            scrollLeft: $('#input_subtitle')[0].scrollLeft+1000
        }, 1000);
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.subtitle !== nextProps.subtitle  && nextProps.subtitle !== '')
            this.setState({subtitle: nextProps.subtitle});
    }

    activateSpeechRecognition() {
        console.log('Activating Speech Recognition...');
        let that = this;
        let final_transcript = '';

        let first_char = /\S/;

        function capitalize(s) {
            return s.replace(first_char, (m) => {
                return m.toUpperCase();
            });
        }

        if (window.hasOwnProperty('webkitSpeechRecognition')) {
            that.recognition = new webkitSpeechRecognition();
        } else if (window.hasOwnProperty('SpeechRecognition')) {
            that.recognition = new SpeechRecognition();
        }

        if (that.recognition) {
            that.recognition.continuous = true;
            that.recognition.interimResults = true;
            that.recognition.lang = navigator.language || navigator.userLanguage;
            that.recognition.maxAlternatives = 0;
            that.recognition.start();

            that.recognition.onresult = function (event) {

                let interim_transcript = '';
                if (typeof (event.results) == 'undefined') {
                    that.recognition.onend = null;
                    that.recognition.stop();
                    console.warn('error:', e);

                    swal({
                        titleText: 'Speech recognition disabled',
                        text: 'There was an error with the speech recognition API. This should be an edge case. You may restart it.',
                        type: 'info',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Enable again',
                        cancelButtonText: 'Keep it disabled',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    }).then(() => {}, (dismiss) => {
                        if (dismiss === 'cancel') {
                            that.recognition.start();
                        }
                    }).then(() => {
                    });

                    return;
                }
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
                final_transcript = capitalize(final_transcript);
                // console.log('Final text: ', final_transcript);
                // console.log('Interim text: ', interim_transcript);

                let m = (final_transcript || interim_transcript);
                let tosend = m.substr((m.length-300) > 0 ? m.length-300 : 0, 300);
                that.props.sendRTCMessage('subtitle', tosend);
                that.setState({subtitle: tosend});
            };

            that.recognition.onerror = function (e) {
                if(e.type === 'error' && e.error !== 'no-speech'){
                    console.log('SpeechRecognition error: ', e);
                    that.disableSpeechRecognition(that);
                    swal({
                        titleText: 'Speech recognition disabled',
                        text: 'An error occured and we had to disable speech recognition. We are sorry about it, but speech recognition is a highly experimental feature. Your listeners will not recieve any transcript anymore.',
                        type: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Okay',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                } else
                    that.recognition.stop();
            };

            that.recognition.onend = function (e) {
                if(!that.state.speechRecognitionDisabled){
                    console.warn('Recognition ended itself - stupid thing! Restarting ....', e);
                    that.recognition.start();
                } else {
                    //TODO in StatusObjekt packen
                }
            };

            let tmp = {};
            ISO6391.getAllCodes().forEach((code) => {
                tmp[''+code] = ISO6391.getName(code);
            });

            swal({
                titleText: 'Speech recognition enabled',
                html: '<p>Speech recognition is an experimental feature. If enabled, your voice will be automatically transcribed and displayed at all peers as a transcript.</p><p>Please select the language in which you will talk or disable the feature.</p>',
                type: 'info',
                input: 'select',
                inputValue: that.recognition.lang,
                inputOptions: tmp,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Okay',
                cancelButtonText: 'Disable',
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: function (lang) {
                    return new Promise((resolve, reject) => {
                        that.recognition.lang = lang;
                        resolve();
                    });
                }
            }).then(() => {}, (dismiss) => {
                if (dismiss === 'cancel') {
                    that.disableSpeechRecognition(that);
                    console.log('Recognition disabled');
                }
            }).then(() => {
                that.props.showInviteModal();
            });

        } else {
            swal({
                titleText: 'Speech recognition disabled',
                text: 'Your browser isn\'t able to transcribe speech to text. Thus, your peers will not recieve a transcript. Google Chrome is currently the only browser that supports speech recognition.',
                type: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Okay',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                that.disableSpeechRecognition(that);
                that.props.showInviteModal();
            });
        }
    }

    showStopSpeechRecognitionModal() {
        swal({
            titleText: 'Disable Speech Recognition',
            text: 'You will deactivate speech recognition for this presentation. You will not be able to turn it back on.',
            type: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Disable',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            this.disableSpeechRecognition(this);
        }, () => {});
    }

    disableSpeechRecognition(context) {
        context.setState({speechRecognitionDisabled: true});
        if(context.recognition)
            context.recognition.stop();
        context.setState((prevState) => {
            return {subtitle: prevState.subtitle + '...Speechrecognition has been disabled'};
        });
        context.props.sendRTCMessage('subtitle', this.state.subtitle);
    }

    render() {
        return (
          <div>
            <Label pointing='below'>Automatically generated transcript</Label>
            <Input labelPosition='left' type='text' fluid>
              <Label>Transcript:</Label>
              <input id="input_subtitle" disabled style={{opacity: 1}} placeholder='...' value={this.state.subtitle}/>
              {this.props.isInitiator ? (<Button color='red' icon='stop' disabled={this.state.speechRecognitionDisabled ? true : false} onClick={this.showStopSpeechRecognitionModal.bind(this)}/>) : ('')}
            </Input>
          </div>
        );
    }
}

SpeechRecognition.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SpeechRecognition;
