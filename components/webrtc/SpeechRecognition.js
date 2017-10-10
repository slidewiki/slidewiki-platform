import React from 'react';
import { Input, Button, Label } from 'semantic-ui-react';
import ISO6391 from 'iso-639-1';

class SpeechRecognition extends React.Component {

/*
  Props:
    isInitiator - var
    speechRecognitionDisabled - var
    start - var start of speech recognition
    sendRTCMessage - func
    subtitle - var

*/

    constructor(props) {
        super(props);

        this.recognition = undefined;
        this.speechRecognitionDisabled = false;
    }

    componentDidMount() {
        this.speechRecognitionDisabled = this.props.speechRecognitionDisabled;
    }

    componentDidUpdate() {
        // console.log('componentDidUpdate', this.props.subtitle, this.props.start);
        this.handleSubtitle(this.props.subtitle);
    }

    componentWillReceiveProps(nextProps) {
        // console.log('componentWillReceiveProps ', this.props.start, nextProps.start);
        if (this.props.start === false && nextProps.start === true) {
            this.activateSpeechRecognition();
        }
    }

    activateSpeechRecognition() {
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
                        title: 'Speech recognition disabled',
                        html: 'There was an error with the speech recognition API. This should be an edge case. You could restart it.',
                        type: 'info',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Enable it',
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
                that.handleSubtitle(tosend);
            };

            that.recognition.onerror = function (e) {
                if(e.type === 'error' && e.error !== 'no-speech'){
                    console.log('SpeechRecognition error: ', e);
                    that.speechRecognitionDisabled = true;
                    that.recognition.stop();
                    swal({
                        title: 'Speech recognition disabled',
                        html: 'An error occured and we had to disable speech recognition. We are sorry about it, but speech recognition is a highly experimental feature. Your listeners will not recieve any subtitles anymore.',
                        type: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Okay',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                    that.forceUpdate();
                } else
                    that.recognition.stop();
            };

            that.recognition.onend = function (e) {
                if(!that.speechRecognitionDisabled){
                    console.warn('Recognition ended itself - stupid thing! Restarting ....', e);
                    that.recognition.start();
                } else {
                    that.props.sendRTCMessage('subtitle', 'Subtitle has been disabled by presenter');
                }
            };

            let tmp = {};
            ISO6391.getAllCodes().forEach((code) => {
                tmp[''+code] = ISO6391.getName(code);
            });

            swal({
                title: 'Speech recognition enabled',
                html: '<p>Speech recognition is an experimental feature. If enabled, your voice will be transcoded and displayed at all peers as a subtitle.</p><p>Please select the language in which you will talk or disable the feature.</p>',
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
                    that.speechRecognitionDisabled = true;
                    that.recognition.stop();
                    console.log('Recognition disabled');
                }
            }).then(() => {
                that.showInviteSwal();
            });

        } else {
            swal({
                title: 'Speech recognition disabled',
                html: '<p>Your browser isn\'t able to transcode speech to text. Thus, your peers will not recieve a subtitle. Google Chrome is currently the only browser that supports speech recognition.</p>',
                type: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Okay',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                that.showInviteSwal();
            });
        }
    }

    showInviteSwal() {
        swal({
            title: 'Invite other people',
            html: '<p>Copy the following link and send it to other people in order to invite them to this room: <br/><br/><strong> ' + window.location.href + '</strong><div id="clipboardtarget"/></p>',
            type: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Copy to Clipboard',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: function() {
                return new Promise((resolve, reject) => {
                    let toCopy = document.createElement('input');
                    toCopy.style.position = 'fixed';
                    toCopy.style.top = 0;
                    toCopy.style.left = 0;
                    toCopy.style.width = '2em';
                    toCopy.style.height = '2em';
                    toCopy.style.padding = 0;
                    toCopy.style.border = 'none';
                    toCopy.style.outline = 'none';
                    toCopy.style.boxShadow = 'none';
                    toCopy.style.background = 'transparent';
                    toCopy.value = window.location.href;
                    document.getElementById('clipboardtarget')
                        .appendChild(toCopy);
                    toCopy.value = window.location.href;
                    toCopy.select();

                    try {
                        let successful = document.execCommand('copy');
                        if (!successful)
                            throw 'Unable to copy';
                        resolve('Copied to clipboard');
                    } catch (err) {
                        console.log('Oops, unable to copy');
                        reject('Oops, unable to copy');
                    }
                });
            }
        })
        .then(() => { this.forceUpdate(); }, () => {});
    }

    handleSubtitle(subtitle) {
        $('#input_subtitle').val(subtitle);
        $('#input_subtitle').animate({
            scrollLeft: $('#input_subtitle')[0].scrollLeft+1000
        }, 1000);
    }

    stopSpeechRecognition() {
        swal({
            title: 'Disable Speech Recognition',
            html: 'You will deactivate speech recognition for this presentation. You will not be able to turn it back on.',
            type: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Disable',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            allowOutsideClick: false
        }).then(() => {
            this.speechRecognitionDisabled = true;
            this.recognition.stop();
            this.forceUpdate();
        }, () => {});
    }

    render() {
        return (
          <div>
            <Label pointing='below'> {this.props.isInitiator ? 'Your Transcoded Voice' : 'Transcoded Speaker Voice'}</Label>
            <Input labelPosition='left' type='text' fluid>
              <Label>Subtitle:</Label>
              <input id="input_subtitle" disabled style={{opacity: 1}} placeholder='...'/>
              {this.props.isInitiator ? (<Button color='red' icon='stop' disabled={this.speechRecognitionDisabled ? true : false} onClick={this.stopSpeechRecognition.bind(this)}/>) : ('')}
            </Input>
          </div>
        );
    }
}

SpeechRecognition.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SpeechRecognition;
