import React from 'react';
import { isEmpty } from '../../common';
import { Button, Icon } from 'semantic-ui-react';
import { Microservices } from '../../configs/microservices';

class SessionRecorder extends React.Component {

/*
  Props:
*/

    constructor(props) {
        super(props);
        this.mediaRecorder = undefined;
        this.chunkKeys = [];
        this.state = {
            recordSession: true
        };

        this.createAudioTrack = this.createAudioTrack.bind(this);
        this.saveTrackToDisk = this.saveTrackToDisk.bind(this);
        this.mime = '';
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.state.recordSession !== nextState.recordSession){
            try {
                this.mediaRecorder.stop();
            } catch (e) {}
            this.chunkKeys = [];
            window.localforage.clear();
        }

    }

    recordSessionModal() {
        return swal({
            titleText: 'Do you want to record this session?',
            html: '<p>We provide the possibility to record this session and to create a video out of it. If you want us to record this session, please click "Yes" below. If not, please click "No".</p><p>We are only recording slide changes and your voice (nothing else). All data stays on your computer until you tell us to create a video out of it. Videos can by only created on our servers due to technological reasons. So if you change your mind and do not want upload anything to us, do not hit the "Save session as video" button in the end. Otherwise, remember to hit this button in the end. <strong>It is not possible to recover a once closed session.</strong></p>',
            type: 'info',
            width: '46rem',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes, record this session',
            showCancelButton: true,
            cancelButtonText: 'No, do not record anything',
            cancelButtonColor: '#d33',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).catch((e) => {
            if(e === 'cancel'){
                this.setState({recordSession: false});
            }
        });
    }

    recordStream(stream) {
        this.stream = stream;
    }

    startRecording() {
        if(this.state.recordSession){
            let webm = 'audio/webm\;codecs=opus', ogg = 'audio/ogg\;codecs=opus';
            this.mime = (MediaRecorder.isTypeSupported(ogg)) ? ogg : webm;
            this.mediaRecorder = new MediaRecorder(this.stream, {mimeType : this.mime, audioBitsPerSecond: 64000});//64kbit/s opus
            this.mediaRecorder.ondataavailable = (chunk) => {
                // console.log('New chunk available', chunk);
                let now = new Date().getTime();
                this.chunkKeys.push({id: now.toString(), timecode: chunk.timecode});
                window.localforage.setItem(now.toString(), chunk.data); //TODO implement catch for promise
            };
            console.log('starting recorder');
            this.mediaRecorder.start(2000);//NOTE 5000 is the only option that works
        }
    }

    StartRecordSlideChanges(deckID, url = '') {
        if(this.state.recordSession){
            if(window.sessionStorage) {
                sessionStorage.setItem('deck', deckID);
                sessionStorage.setItem('origin', window.location.origin);
                sessionStorage.setItem('slideTimings', '');//clear it
                this.recordSlideChange(url);
            }
        }
    }

    recordSlideChange(url = '') {
        if(this.state.recordSession){
            // console.log('recording slide change', url, first);
            if(window.sessionStorage){
                let prev = sessionStorage.getItem('slideTimings');
                prev = (isEmpty(prev)) ? '{}' : prev;
                prev = JSON.parse(prev);
                let now = new Date().getTime();
                let newEl = {};
                newEl[now] = url;
                let toSave = Object.assign(prev, newEl);
                sessionStorage.setItem('slideTimings', JSON.stringify(toSave));
            }
        }
    }

    saveRecording() {
        this.mediaRecorder.pause();
        swal({
            titleText: 'Save this session as a video?',
            text: 'We will upload your speech and slide changes (nothing else) to our servers and create a video out of it. This is, due to technologcial reasons, only possible serverside. If you agree, please click "Yes". If you do not want to upload something, please click "No". We will continue to record until you either close this window or save your session as a video.',
            type: 'question',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No',
            cancelButtonColor: '#d33',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            this.mediaRecorder.stop();
            this.recordSlideChange();
            // let timingBlob = new Blob([sessionStorage.getItem('slideTimings')], {type: 'application/json'});
            // this.saveBlobToDisk(timingBlob, 'timings.json');
            setTimeout(this.createAudioTrack, 500);//NOTE Wait for recorder to write last chunk
        }).catch((e) => {
            if(e === 'cancel'){
                this.mediaRecorder.resume();
            }
        });
    }

    createAudioTrack() {
        let promises = this.chunkKeys.map((obj) => window.localforage.getItem(obj.id));
        Promise.all(promises).then((blobArray) => {
            let safeChunkArray = (isEmpty(blobArray)) ? [] : blobArray;//TODO implement better version
            console.log(safeChunkArray);
            let track = new Blob(safeChunkArray, { 'type' : this.mime });
            console.log(track);
            let trackName = 'test' + ((this.mime.includes('webm')) ? '.webm' : '.ogg');
            // console.log(name);
            // this.saveTrackToDisk(track, trackName);
            this.uploadTrack(track, trackName, sessionStorage.getItem('slideTimings'));
        });
    }

    uploadTrack(audioTrack, audioTrackName, slideTimings) {
        let form = new FormData();
        form.append('slideTimings', slideTimings);
        form.append('audioFile', audioTrack, audioTrackName);

        $.ajax({
            url: Microservices.file.uri + '/PRvideo?deckID=' + this.props.deckID +'&revision=' + (this.props.revision ? this.props.revision : 1),
            data: form,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            success: ( data, textStatus, jqXHR ) => {
                console.log(textStatus);
            },
            error: ( jqXHR, textStatus, errorThrown) => {
                console.log(textStatus, errorThrown, jqXHR);
            }
        });
    }

    saveTrackToDisk(file, fileName) {
        let hyperlink = document.createElement('a');
        hyperlink.style.display = 'none';
        hyperlink.href = URL.createObjectURL(file);
        hyperlink.target = '_blank';
        hyperlink.download = fileName;

        if (!!navigator.mozGetUserMedia) {
            hyperlink.onclick = function() {
                (document.body || document.documentElement).removeChild(hyperlink);
            };
            (document.body || document.documentElement).appendChild(hyperlink);
        }

        let evt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        hyperlink.dispatchEvent(evt);

        if (!navigator.mozGetUserMedia) {
            URL.revokeObjectURL(hyperlink.href);
        }
    }

    render() {
        return (
          <Button style={{position: 'fixed', padding: '5px', margin: 0, right: '50%', top: '0', borderRadius: '0 0 5px 5px', display: (this.state.recordSession) ? '': 'none'} } icon={<Icon name="record" color={(this.state.recordSession) ? 'red' : ''}/>} disabled={this.state.recordSession ? false : true} onClick={this.saveRecording.bind(this)} aria-haspopup="true" data-tooltip={this.state.recordSession ? ' Recording...': 'Recording stopped'} data-position="bottom center"/>
        );
    }
}

SessionRecorder.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SessionRecorder;
