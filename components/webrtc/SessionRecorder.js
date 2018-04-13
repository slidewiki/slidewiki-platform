import React from 'react';
import { isEmpty } from '../../common';
import { Button, Icon } from 'semantic-ui-react';
import { Microservices } from '../../configs/microservices';
import UserProfileStore from '../../stores/UserProfileStore';

class SessionRecorder extends React.Component {

/*
  Props:
*/

    constructor(props) {
        super(props);
        this.mediaRecorder = undefined;
        this.chunkKeys = [];
        this.state = {
            recordSession: false,
            recordingStopped: false,
            stream: false,
            iframeLoaded: false,
            modalAccepted: false,
        };

        this.createAudioTrack = this.createAudioTrack.bind(this);
        this.mime = '';
        this.stream = null;
        this.initialURL = '';
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.state.stream !== nextState.stream || this.state.iframeLoaded !== nextState.iframeLoaded || this.state.modalAccepted !== nextState.modalAccepted){
            if(nextState.modalAccepted && nextState.stream && nextState.iframeLoaded)
                this.startRecording();
        }
    }

    recordSessionModal() {
        if(isEmpty(this.context.getUser().username))
            return;
        else {
            return swal({
                titleText: 'Do you want to record this session?',
                html: '<p>We provide the possibility to record this session and to create a video out of it.</p><p>We are only recording slide changes and your voice (nothing else). All data stays on your computer until you tell us to create a video out of it. Videos can by only created on our servers due to technological reasons. So if you change your mind and do not want upload anything to us, do not hit the camera button in the end. Otherwise, remember to hit this button in the end. <strong>It is not possible to recover a once closed session.</strong></p>',
                type: 'info',
                width: '46rem',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Yes, record this session',
                showCancelButton: true,
                cancelButtonText: 'No, do not record anything',
                cancelButtonColor: '#d33',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                console.log(result);
                if (!result.dismiss)
                    this.setState({modalAccepted: true});
            }).catch(() => {});
        }
    }

    recordStream(stream) {
        this.setState({stream: true});
        this.stream = stream;
    }

    startRecording() {
        let webm = 'audio/webm\;codecs=opus', ogg = 'audio/ogg\;codecs=opus';
        this.mime = (MediaRecorder.isTypeSupported(ogg)) ? ogg : webm;
        this.mediaRecorder = new MediaRecorder(this.stream, {mimeType : this.mime, audioBitsPerSecond: 64000});//64kbit/s opus
        this.mediaRecorder.ondataavailable = (chunk) => {
            let now = new Date().getTime();
            this.chunkKeys.push({id: now.toString()}); //TODO remove object
            window.localforage.setItem(now.toString(), chunk.data); //TODO implement catch for promise, if error disable recording
        };
        console.log('starting recorder');
        this.recordSlideChange(this.initialURL);
        this.mediaRecorder.start(2000);
        this.setState({recordSession: true});
    }

    StartRecordSlideChanges(deckID, url = '') {
        if(window.sessionStorage) { //TODO else condition: if error disable recording
            sessionStorage.setItem('deck', deckID);
            sessionStorage.setItem('origin', window.location.origin);
            sessionStorage.setItem('slideTimings', '');//clear it
            this.initialURL = url;
            this.setState({iframeLoaded: true});
        }
    }

    recordSlideChange(url = '') { //TODO handle paused and resumed
        // console.log('recording slide change', url, first);
        if(window.sessionStorage){
            let prev = sessionStorage.getItem('slideTimings');
            prev = (isEmpty(prev)) ? '{}' : prev;
            prev = JSON.parse(prev);
            prev[new Date().getTime()] = url;
            sessionStorage.setItem('slideTimings', JSON.stringify(prev));
        } //TODO else condition
    }

    saveRecording() {
        this.mediaRecorder.pause();
        this.recordSlideChange('paused');
        this.setState({recordingStopped: true});
        swal({ //TODO add third button for delete record and starting later again
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
            setTimeout(this.createAudioTrack, 500);//NOTE Wait for recorder to write last chunk
        }).catch((e) => {
            if(e === 'cancel'){
                this.setState({recordingStopped: false});
                this.mediaRecorder.resume();
                this.recordSlideChange('resumed');
            } //TODO add else case for error in promise
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
            this.uploadTrack(track, trackName, sessionStorage.getItem('slideTimings'));
        }); //TODO catch case
    }

    uploadTrack(audioTrack, audioTrackName, slideTimings) {
        let form = new FormData();
        form.append('slideTimings', slideTimings);
        form.append('audioFile', audioTrack, audioTrackName);

        $.ajax({
            url: Microservices.file.uri + '/PRvideo?deckID=' + this.props.deckID +'&revision=' + (this.props.revision ? this.props.revision : 1),
            data: form,
            headers: {
                '----jwt----': this.context.getUser().jwt
            },
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            success: ( data, textStatus, jqXHR ) => {
                console.log(textStatus); //TODO loading indicator and message
            },
            error: ( jqXHR, textStatus, errorThrown) => {
                console.log(textStatus, errorThrown, jqXHR);
            }
        });
    }

    render() {
        return (
          <div>
          {this.state.recordSession ? <Button style={{position: 'fixed', padding: '5px', margin: 0, right: '50%', top: '0', borderRadius: '0 0 5px 5px'}} icon={<Icon name="record" color={(!this.state.recordingStopped) ? 'red' : 'grey'}/>} disabled={!this.state.recordingStopped ? false : true} onClick={this.saveRecording.bind(this)} aria-haspopup="true" role="button" data-tooltip={!this.state.recordingStopped ? 'Click to pause recording and open dialog.': 'Recording stopped'} data-position="bottom center"/> : ''}
          </div>

        );
    }
}

SessionRecorder.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getUser: React.PropTypes.func
};

export default SessionRecorder;
