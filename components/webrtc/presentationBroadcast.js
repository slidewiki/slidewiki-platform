import React from 'react';
import { handleRoute, navigateAction} from 'fluxible-router';
import { provideContext } from 'fluxible-addons-react';
import { isEmpty } from '../../common';
import { Grid, Button, Popup } from 'semantic-ui-react';
import {Microservices} from '../../configs/microservices';
import SpeechRecognition from './SpeechRecognition.js';
import Chat from './Chat.js';

class presentationBroadcast extends React.Component {

    constructor(props) {
        super(props);
        this.texts = {roleText: '', peerCountText: ''};
        this.isInitiator = false;
        this.localStream = undefined;
        this.myID = undefined;
        this.presenterID = undefined;
        this.pcs = {}; // {<socketID>: {RTCConnection: RPC, dataChannel: dataChannel, username: username}, <socketID>: {RTCConnection: RPC, dataChannel: dataChannel, username: username}}
        this.turnReady = undefined;
        this.pcConfig = {'iceServers': Microservices.webrtc.iceServers};
        this.room = this.props.currentRoute.query.room + '';//NOTE Error handling implemented in first lines of componentDidMount
        this.socket = undefined;
        this.lastMessage = {};
        this.maxPeers = 100;

        //******** SlideWiki specific variables ********
        this.eventForwarding = true;
        this.iframesrc = this.props.currentRoute.query.presentation + '';//NOTE Error handling implemented in first lines of componentDidMount
        this.lastRemoteSlide = this.iframesrc + '';
        this.paused = false; //user has manually paused slide transitions
        this.currentSlide = this.iframesrc + '';
        this.subtitle = '';//used for speech recognition results
        this.speechRecognitionDisabled = false;
        this.startSpeechrecognition = false;
    }

    componentDidMount() {

        let that = this;
        if(isEmpty(that.iframesrc) || that.iframesrc === 'undefined' || isEmpty(that.room) || that.room === 'undefined'){
            console.log('Navigating away because of missing paramenters in URL');
            swal({
                title: 'Something went terribly wrong',
                html: 'It seems like your URL isn\'t correct. Please report this as a bug. You will now be redirected to the homepage.',
                type: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Okay',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {that.context.executeAction(navigateAction, {'url': '/'});});
            return;
        }
        //Remove menus as they shouldn't appear
        $('.menu:first').remove();
        $('.footer:first').remove();

        that.socket = io(Microservices.webrtc.uri);

        let deckID = that.iframesrc.toLowerCase().split('presentation')[1].split('/')[1];//TODO implement a better version to get the deckID
        that.socket.emit('create or join', that.room, deckID);
        console.log('Attempt to create or join room', that.room);

        function setmyID() {
            if (that.myID === undefined)
                that.myID = that.socket.id;
            return that.myID;
        }

        that.socket.on('created', (room, socketID) => { //only initiator recieves this
            console.log('Created room ' + that.room);
            that.isInitiator = true;
            that.texts.roleText = 'You are the presenter. Other people will hear your voice and reflect your presentation progress. ';
            that.texts.peerCountText = 'People currently listening: ';
            that.forceUpdate();
            setmyID();
            $('#slidewikiPresentation').on('load', activateIframeListeners);
            requestStreams({
                audio: true,
                // video: {
                //   width: { min: 480, ideal: 720, max: 1920 },
                //   height: { min: 360, ideal: 540, max: 1080 },
                //   facingMode: "user"
                // }
            });
        });

        that.socket.on('join', (room, socketID) => { //whole room recieves this, except for the peer that tries to join
            // a listener will join the room
            console.log('Another peer made a request to join room ' + room);
            if (that.isInitiator) {
                // console.log('This peer is the initiator of room ' + that.room + '!');
                let numberOfPeers = Object.keys(this.pcs).length;
                console.log(numberOfPeers, this.maxPeers);
                if (numberOfPeers >= this.maxPeers)
                    that.socket.emit('room is full', socketID);
                else
                    that.socket.emit('ID of presenter', that.myID, socketID);
            }
        });

        that.socket.on('joined', (room) => { //only recieved by peer that tries to join - a peer has joined the room
            console.log('joined: ' + that.room);
            setmyID();
            that.texts.roleText = 'You are now listening to the presenter and your presentation will reflect his actions.';
            that.forceUpdate();
            $('#slidewikiPresentation').on('load', activateIframeListeners);
            gotStream('');//NOTE Skip requesting streams for the listeners, as they do not need them

            that.forceUpdate();
            swal.queue([{
                title: 'You\'re about to join a live presentation',
                html: 'Nice to see you here! You will hear the presenters voice in a few moments and your presentation will reflect his progress. Just lean back and keep watching. In case you have any questions to the presenter, please use the "Send Question" functionality.',
                type: 'info',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Okay',
                allowOutsideClick: false,
                allowEscapeKey: false,
                onOpen: () => {
                    swal.showLoading();
                },
                preConfirm: () => {
                    return new Promise((resolve) => {
                        $('body>a#atlwdg-trigger').remove();
                        resolve();
                    });
                }
            }]);
        });

        that.socket.on('full', (room) => { //only recieved by peer that tries to join
            console.log('Room ' + that.room + ' is full');
            that.socket.close();
            swal({
                title: 'Room ' + room + ' is full',
                html: 'Rooms have limited capacities for people. The room you tried to join is already full.',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Okay',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
        });

        that.socket.on('ID of presenter', (id) => {
            if(!that.isInitiator)
                console.log('Received ID of presenter: ', id);
            that.presenterID = id;
        });

        that.socket.on('room is full', () => {
            console.log('Received room is full');
            swal({
                title: '<p>The presentation room is full.</p>',
                html: '<p>The maximium number of listeners is already reached. Please try again later.</p>',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Check',
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            that.socket.close();
        });

        that.socket.on('log', (array) => {
            setmyID();
        });

        that.socket.on('disconnect', () => {
            console.info('Closed socket');
        });

        ////////////////////////////////////////////////

        function sendMessage(cmd, data = undefined, receiver = undefined) {
            // console.log('Sending message over socket: ', cmd, data, receiver);
            that.socket.emit('message', { 'cmd': cmd, 'data': data, 'sender': that.myID, 'receiver': receiver });
        }

        function sendRTCMessage(cmd, data = undefined, receiver = undefined) {
            let message = JSON.stringify({ 'cmd': cmd, 'data': data, sender: that.myID });
            if (receiver) { //send to one peer only
                // console.log('Sending message to peer: ', receiver);
                try {
                    that.pcs[receiver].dataChannel.send(message);
                } catch (e){
                    console.log('SendRTCMessage error: ', e);
                }
            } else { //broadcast from initiator
                // console.log('Broadcasting message to peers');
                for (let i in that.pcs) {
                    if (that.pcs[i].dataChannel)
                        try {
                            that.pcs[i].dataChannel.send(message);
                        } catch (e){
                            console.log('SendRTCMessage error: ', e);
                        }
                }
            }
        }
        that.sendRTCMessage = sendRTCMessage;

        // This client receives a message
        that.socket.on('message', (message) => {
            if (message.sender === that.myID) { //Filter for messages from myself
                if (message.cmd === 'peer wants to connect' && Object.keys(that.pcs).length === 0) { //peer triggers itself
                    start(that.presenterID);
                }
            } else if (message.receiver === that.myID) { //adressed to me
                // console.log('Recieved message from peer: ', message);
                if (message.cmd === 'peer wants to connect' && that.isInitiator) { //Everyone recieves this, except for the peer itself, as soon as a peer joins, only from peer
                    start(message.sender);
                } else if (message.cmd === 'offer' || (message.cmd === 'answer' && that.isInitiator)) { //offer by initiator, answer by peer
                    that.pcs[message.sender].RTCconnection.setRemoteDescription(new RTCSessionDescription(message.data));
                    if (message.cmd === 'offer') // führt nur der peer aus
                        doAnswer(message.sender);
                }
                if (message.cmd === 'candidate') {
                    try { //Catch defective candidates
                        let candidate = new RTCIceCandidate({
                            sdpMLineIndex: message.data.label,
                            candidate: message.data.candidate
                        });
                        that.pcs[message.sender].RTCconnection.addIceCandidate(candidate).catch((e) => {
                            console.log('Error: was unable to add Ice candidate:', candidate, 'to sender', message.sender);
                        }); //Catch defective candidates, TODO add better exception handling
                    } catch (e) {
                        console.log('Error: building the candiate failed with', message);
                    }//TODO add better exception handling
                }
            }
        });

        //******** Media specific methods ********

        function requestStreams(options) {
            navigator.mediaDevices.getUserMedia(options)
                .then(gotStream)
                .catch((err) => {
                    switch (err.name) {
                        case 'NotAllowedError'://The user declined the use of the media device(s)
                            if(that.isInitiator)
                                requestStreamsErrorHandler('No access to microphone', 'Your browser reported that you refused to grant this application access to your microphone. The presention rooms feature is not usable without a microphone. Please grant us access to your microphone (see your URL bar) and click the Okay button. The room will be automatically recreated.', 'warning');
                            else
                                console.log('getUserMedia() error: ' + err.name);
                            break;
                        default:
                            console.log('getUserMedia() error: ' + err.name);
                            if(that.isInitiator)
                                requestStreamsErrorHandler('Device error', 'Your browser reported a problem accessing your microphone. You can\'t use the presention rooms feature without a microphone. Please try to fix your microphone (settings) and open up a new room. You will be redirected to the homepage.', 'error');
                            else
                                requestStreamsErrorHandler('Browser Error', 'Your browser reported a technical problem. You can\'t use the presention rooms feauter with this problem. Please try to fix it by updating your browser or resetting it and rejoin a room. You will be redirected to the homepage.', 'error');
                    }
                });
        }

        function requestStreamsErrorHandler(title1, text1, type1) {
            let dialog = {
                title: title1,
                html: text1,
                type: type1,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Okay',
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: () => {
                    return new Promise((resolve) => {
                        cleanup();
                        if(type1 === 'error')
                            that.context.executeAction(navigateAction, {'url': '/'});
                        else
                            location.reload();
                        resolve();
                    });
                }
            };

            that.socket.close();
            if(swal.isVisible())
                swal.insertQueueStep(dialog);
            else
              swal(dialog);
        }

        function gotStream(stream) {
            console.log('Adding local stream');
            if (that.isInitiator) {
                //$('#media').append('<video id="localVideo" autoplay></video>');
                //let localVideo = document.querySelector('#localVideo');
                //localVideo.srcObject = stream;
                $('#media').remove();
                swal({//NOTE implemented here because this dialog interrupted with error dialogs of requestStreams()
                    title: '<p>Room <i>' + that.room + '</i> successfully created!</p>',
                    html: '<p>Other people are free to join the room. Rooms are currently limited to '+that.maxPeers+' people. See the counter at the bottom of the page for information about currently listening people.</p>',
                    type: 'info',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Check',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(() => { that.startSpeechrecognition = true; that.forceUpdate(); $('body>a#atlwdg-trigger').remove();});
            }
            that.localStream = stream;

            function sendASAP() {
                if (that.presenterID) //wait for presenterID before sending the message
                    sendMessage('peer wants to connect', undefined, that.presenterID);
                else
                    setTimeout(() => { sendASAP(); }, 10);
            }

            if (!that.isInitiator) {
                sendASAP();
            }
        }

        function start(peerID) {
            if (typeof that.localStream !== 'undefined') {
                console.log('creating RTCPeerConnnection for', (that.isInitiator) ? 'initiator' : 'peer');
                createPeerConnection(peerID);
                if (that.isInitiator){
                    that.localStream.getTracks().forEach((track) => that.pcs[peerID].RTCconnection.addTrack(track, that.localStream));
                    doCall(peerID);
                }
            }
        }

        window.onbeforeunload = function() {
            hangup();
        };

        //******** WebRTC specific methods ********

        function createPeerConnection(peerID) {
            try {
                that.pcs[peerID] = {};
                that.pcs[peerID].RTCconnection = new RTCPeerConnection(that.pcConfig);
                that.pcs[peerID].RTCconnection.onicecandidate = handleIceCandidate.bind(that, peerID);
                that.pcs[peerID].RTCconnection.ontrack = handleRemoteStreamAdded;
                that.pcs[peerID].RTCconnection.onremovestream = handleRemoteStreamRemoved;
                that.pcs[peerID].RTCconnection.oniceconnectionstatechange = handleICEConnectionStateChange.bind(that, peerID);
                if (that.isInitiator) {
                    that.pcs[peerID].dataChannel = that.pcs[peerID].RTCconnection
                        .createDataChannel('messages', {
                            ordered: true
                        });
                    onDataChannelCreated(that.pcs[peerID].dataChannel, peerID);
                } else
                    that.pcs[peerID].RTCconnection.ondatachannel = handleDataChannelEvent.bind(that, peerID);

                console.log('Created RTCPeerConnnection');
                if (that.isInitiator){
                    that.forceUpdate();
                }
            } catch (e) {
                console.log('Failed to create PeerConnection, exception: ' + e.message);
                console.log('Cannot create RTCPeerConnection object.');
                connectionFailureHandler();
                return;
            }
        }

        function connectionFailureHandler() {
            let dialog = {
                title: 'An error occured',
                html: 'We\'re sorry, but we can\'t connect you to the presenter. It seems like there is a problem with your connection or browser. Please update your browser, disable extensions or ask your network operator about it. We\'re using a peer to peer connection technique called WebRTC.',
                type: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Okay',
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: () => {
                    return new Promise((resolve) => {
                        cleanup();
                        that.context.executeAction(navigateAction, {'url': '/'});
                        resolve();
                    });
                }
            };
            if(swal.isVisible){
                swal.hideLoading();//NOTE is currently not working, contacted developer.
                swal.insertQueueStep(dialog);
                swal.clickConfirm();
            } else
              swal(dialog);
        }

        function handleICEConnectionStateChange(peerID, event) {
            if(that.pcs[peerID] && that.pcs[peerID].RTCconnection){
                switch(that.pcs[peerID].RTCconnection.iceConnectionState) {
                    case 'connected':
                        console.log('The connection has been successfully established');
                        if(!that.isInitiator){
                            try {
                                swal.hideLoading();
                            } catch (e) {
                                console.log('Error: swal was not defined', e);
                            }
                        }
                        break;
                    case 'disconnected':
                        console.log('The connection has been terminated');
                        break;
                    case 'failed':
                        console.warn('The connection has failed');
                        if(!that.isInitiator)
                            connectionFailureHandler();
                        else
                            stop(peerID);
                        break;
                    case 'closed':
                        console.log('The connection has been closed');
                        break;
                }
            }
        }

        function handleDataChannelEvent(peerID, event) { //called by peer
            // console.log('ondatachannel:', event.channel);
            that.pcs[peerID].dataChannel = event.channel;
            that.pcs[peerID].dataChannel.onclose = handleRPCClose; //NOTE dirty workaround as browser are currently not implementing RPC.onconnectionstatechange
            onDataChannelCreated(that.pcs[peerID].dataChannel, peerID);
        }

        function handleRPCClose() {
            if (!that.isInitiator) {
                swal({
                    title: '<p>The presenter closed the session</p>',
                    html: '<p>This presentation has ended. Feel free to look at the deck as long as you want.</p>',
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Check',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                that.texts.roleText = 'This presentation has ended. Feel free to look at the deck as long as you want.';
                that.texts.peerCountText = '';
                that.forceUpdate();
                handleRemoteHangup(that.presenterID);
            }
        }

        function onDataChannelCreated(channel, peerID) { //called by peer and by initiatior
            console.log('Created data channel for ', peerID);
            /*NOTE Browsers do currenty not support events that indicate whether ICE exchange has finished or not and the RPC connection has been fully established. Thus, I'm waiting for latest event onDataChannelCreated in order to close the that.socket after some time. This should be relativly safe.
             */
            if (!that.isInitiator && that.socket.disconnected === false) {
                setTimeout(() => that.socket.close(), 10000); //close that.socket after 10 secs, TODO maybe come up with a better solution
            }

            channel.onopen = function() {
                console.log('Data Channel opened');
                if (that.isInitiator)
                    sendRTCMessage('gotoslide', document.getElementById('slidewikiPresentation').contentWindow.location.href, peerID);// using href instead of currentSlide because it could be bad initialized
                else {
                    that.sendUsername();
                }
            };

            channel.onmessage = handleMessage.bind(that, channel, peerID);
        }

        function handleIceCandidate(peerID, event) {
            if (event && ((event.target && event.target.iceGatheringState !== 'complete') || event.candidate !== null)) {
                sendMessage('candidate', {
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                }, peerID);
            } else {
                console.log('End of candidates.');
            }
        }

        function handleRemoteStreamAdded(event) {
            if (that.isInitiator === false) {
                $('#media').append('<audio class="remoteAudio" autoplay></audio>');
                let remoteAudios = $('.remoteAudio');
                remoteAudios[remoteAudios.length - 1].srcObject = event.streams[0];
            }
        }

        function handleCreateOfferError(event) {
            console.log('createOffer() error: ', event);//TODO add better error handling for this - maybe close the window if this is fatal
        }

        function doCall(peerID) { //calledy by initiatior
            that.pcs[peerID].RTCconnection.createOffer(setLocalAndSendMessage.bind(that, peerID), handleCreateOfferError);
        }

        function doAnswer(peerID) {
            that.pcs[peerID].RTCconnection.createAnswer()
                .then(
                    setLocalAndSendMessage.bind(that, peerID),
                    onCreateSessionDescriptionError
                );
        }

        function setLocalAndSendMessage(peerID, sessionDescription) {
            // Set Opus as the preferred codec in SDP if Opus is present.
            sessionDescription.sdp = preferOpus(sessionDescription.sdp);
            that.pcs[peerID].RTCconnection.setLocalDescription(sessionDescription);
            sendMessage(sessionDescription.type, sessionDescription, peerID);
        }

        function onCreateSessionDescriptionError(error) {//TODO add better error handling for this - maybe close the window if this is fatal
            trace('Failed to create session description: ' + error.toString());
        }

        function handleRemoteStreamRemoved(event) {
            console.log('Remote stream removed. Event: ', event);
        }

        function hangup() { //calledy by peer and by initiatior
            console.log('Hanging up.');
            if (that.isInitiator) {
                stop(undefined, true);
            } else {
                sendRTCMessage('bye', that.myID, that.presenterID);
                stop(that.presenterID);
            }
            //NOTE Don't need to close the socket, as the browser does this automatically if the window closes
        }

        function handleRemoteHangup(peerID) { //called by initiator
            console.log('Terminating session for ', peerID);
            stop(peerID);
        }

        function stop(peerID, presenter = false) {
            try {
                if (presenter) {
                    for (let i in that.pcs) {
                        that.pcs[i].dataChannel.close();
                        that.pcs[i].RTCconnection.close();
                        delete that.pcs[i];
                    }
                } else {
                    that.pcs[peerID].dataChannel.close();
                    that.pcs[peerID].RTCconnection.close();
                    delete that.pcs[peerID];
                }
            } catch (e) {//TODO add better error handling
                console.log('Error when deleting RTC connections', e);
            } finally {
                if (that.isInitiator){
                    that.forceUpdate();
                }
            }
        }

        function cleanup() {
            try {
                that.socket.close();
            } catch (e) {}
            try {
                stop(undefined, true);
            } catch (e) {}
        }

        function handleMessage(channel, peerID, event) {
            // console.log(event.data);
            if (event.data === undefined)
                return;
            let data = JSON.parse(event.data);
            switch (data.cmd) {
                case 'gotoslide':
                    if (!that.isInitiator)
                        changeSlide(data.data);
                    break;
                case 'toggleblackscreen':
                    if (!that.isInitiator)
                        toggleBlackScreen();
                    break;
                case 'message':
                    if (that.isInitiator) {
                        this.lastMessage = {
                            data: data,
                            peerID: peerID
                        };
                        this.forceUpdate();
                    }
                    break;
                case 'log':
                    console.log('Recieved log message from peer: ', data.data);
                    break;
                case 'bye':
                    handleRemoteHangup(data.data);
                    break;
                case 'subtitle':
                    this.subtitle = data.data;
                    this.forceUpdate();
                    break;
                case 'newUsername':
                    handleNewUsername(data.data, peerID);
                    break;
                case 'completeTask':
                    showCompleteTaskModal();
                    break;
                case 'taskCompleted':
                    checkUser(data.sender);
                    break;
                case 'closeAndProceed':
                    closeModal();
                    break;
                default:

            }
        }

        //******** Media Codec specific methods (like Opus) ********

        function preferOpus(sdp) { // Set Opus as the default audio codec if it's present.
            let sdpLines = sdp.split('\r\n');
            let mLineIndex;
            // Search for m line.
            for (let i = 0; i < sdpLines.length; i++) {
                if (sdpLines[i].search('m=audio') !== -1) {
                    mLineIndex = i;
                    break;
                }
            }
            if (mLineIndex === null) {
                return sdp;
            }

            // If Opus is available, set it as the default in m line.
            for (let i = 0; i < sdpLines.length; i++) {
                if (sdpLines[i].search('opus/48000') !== -1) {
                    let opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
                    if (opusPayload) {
                        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex],
                            opusPayload);
                    }
                    break;
                }
            }

            // Remove CN in m line and sdp.
            sdpLines = removeCN(sdpLines, mLineIndex);

            sdp = sdpLines.join('\r\n');
            return sdp;
        }

        function extractSdp(sdpLine, pattern) {
            let result = sdpLine.match(pattern);
            return result && result.length === 2 ? result[1] : null;
        }

        function setDefaultCodec(mLine, payload) { // Set the selected codec to the first in m line.
            let elements = mLine.split(' ');
            let newLine = [];
            let index = 0;
            for (let i = 0; i < elements.length; i++) {
                if (index === 3) { // Format of media starts from the fourth.
                    newLine[index++] = payload; // Put target payload to the first.
                }
                if (elements[i] !== payload) {
                    newLine[index++] = elements[i];
                }
            }
            return newLine.join(' ');
        }

        function removeCN(sdpLines, mLineIndex) { // Strip CN from sdp before CN constraints is ready.
            let mLineElements = sdpLines[mLineIndex].split(' ');
            // Scan from end for the convenience of removing an item.
            for (let i = sdpLines.length - 1; i >= 0; i--) {
                let payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
                if (payload) {
                    let cnPos = mLineElements.indexOf(payload);
                    if (cnPos !== -1) {
                        // Remove CN payload from m line.
                        mLineElements.splice(cnPos, 1);
                    }
                    // Remove CN line in sdp
                    sdpLines.splice(i, 1);
                }
            }

            sdpLines[mLineIndex] = mLineElements.join(' ');
            return sdpLines;
        }

        //******** SlideWiki specific methods ********

        function toggleBlackScreen() {//TODO won't unpause the screen - I have no idea why...
            let frame = document.getElementById('slidewikiPresentation').contentDocument;
            let newEvent = new Event('keydown', {keyCode: 58});
            newEvent.keyCode = 58;
            newEvent.which = 58;
            // frame.dispatchEvent(newEvent);
        }

        function activateIframeListeners() {
            console.log('Adding iframe listeners');
            let iframe = $('#slidewikiPresentation').contents();

            document.addEventListener('keydown', (e) => {//NOTE used for arrow keys
                let frame = document.getElementById('slidewikiPresentation').contentDocument;
                let newEvent = new Event('keydown', {key: e.key, code: e.code, composed: true, charCode: e.charCode, keyCode: e.keyCode, which: e.which, bubbles: true, cancelable: true, which: e.keyCode});
                newEvent.keyCode = e.keyCode;
                newEvent.which = e.keyCode;
                if(that.eventForwarding)
                    frame.dispatchEvent(newEvent);
            });

            if (that.isInitiator) {
                iframe.on('slidechanged', () => {
                    that.currentSlide = document.getElementById('slidewikiPresentation').contentWindow.location.href;
                    sendRTCMessage('gotoslide', that.currentSlide);
                });
                iframe.on('paused', () => {
                    sendRTCMessage('toggleblackscreen');
                });
                iframe.on('resumed', () => {
                    sendRTCMessage('toggleblackscreen');
                });
            } else {
                iframe.on('slidechanged', () => {
                    if (document.getElementById('slidewikiPresentation').contentWindow.location.href !== that.lastRemoteSlide) {
                        that.paused = true;
                        that.forceUpdate();
                    }
                });
                let textArea = $('#messageToSend');
                textArea.on('focus', () => {
                    that.eventForwarding = false;
                });
                textArea.on('focusout', () => {
                    that.eventForwarding = true;
                });
            }
        }

        function changeSlide(slideID) { // called by peers
            that.lastRemoteSlide = slideID;
            if (!that.paused) {
                console.log('Changing to slide: ', slideID);
                that.iframesrc = slideID;
                document.getElementById('slidewikiPresentation').contentWindow.location.assign(slideID);
                that.forceUpdate();
            }
        }
        that.changeSlide = changeSlide;


        function handleNewUsername(username, peerID) {
            that.pcs[peerID].username = username;
            that.forceUpdate();
        }

        function showCompleteTaskModal() {
            swal({
                title: 'Complete the given Task',
                text: 'The presenter asked you to complete a task. As soon as you have completed the task, click on "Completed" and wait for the presenter to proceed.',
                type: 'info',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Completed',
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(() => {
                sendRTCMessage('taskCompleted',undefined, that.presenterID);
            });
        }

        function checkUser(id) {
            $('input#'+id).prop('checked', true);
        }

        function closeModal() {
            swal.closeModal();
        }
    }



    sendUsername() {
        if (this.context && this.context.getUser() && this.context.getUser().username)
            this.sendRTCMessage('newUsername', this.context.getUser().username, this.presenterID);
    }

    audienceCompleteTask (event) {
        let toInsert = Object.keys(this.pcs).map((key) => {
            let username = this.pcs[key].username ? this.pcs[key].username : 'Anonymous Rabbit';
            return '<div><input type="checkbox" disabled id="' + key + '"> ' + username + '</input><br/></div>';
        }).reduce((a,b) => a + b, '');
        toInsert = (toInsert.length > 0) ? toInsert : '<p>There is currently no audience</p>';
        swal({
            title: 'Audience Progress',
            html: toInsert,
            type: 'info',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'End Task',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            this.sendRTCMessage('closeAndProceed');
        });
        this.sendRTCMessage('completeTask');
    }



    resumePlayback(){
        this.paused = false;
        this.changeSlide(this.lastRemoteSlide);
    }

    copyURLToClipboard() {
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
        document.body.appendChild(toCopy);
        toCopy.value = window.location.href;
        toCopy.select();

        try {
            let successful = document.execCommand('copy');
            if(!successful)
                throw 'Unable to copy';
            else{
                swal({
                    title: 'URL copied to clipboard',
                    type: 'success',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    timer: 1500
                }).then(() => {}, () => {});
            }
        } catch (err) {
            console.log('Oops, unable to copy');
            swal({
                title: 'Can\'t copy URL to clipboard',
                text: 'Please select the URL in your browser and share it manually.',
                type: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Check',
                allowOutsideClick: false
            });
        }
        document.body.removeChild(toCopy);
    }

    render() {
        let peernames = new Set(Object.keys(this.pcs).map((key) => {
            return this.pcs[key].username ? this.pcs[key].username : 'Anonymous Rabbits';
        }));
        peernames = Array.from(peernames).reduce((a,b) => a+', '+b, '').substring(1);

        let height = typeof window !== 'undefined' ? window.innerHeight : 961;

        return (
          <Grid celled='internally'>
            <Grid.Row>
              <Grid.Column width={13}>
                <iframe id="slidewikiPresentation" src={this.iframesrc}
                height={height*0.78 + 'px'} width="100%" frameBorder="0" style={{border: 0}}></iframe>
              </Grid.Column>
              <Grid.Column width={3} style={{'overflowY': 'auto', 'whiteSpace': 'nowrap', 'maxHeight': height*0.78 + 'px'}}>
                <Chat isInitiator={this.isInitiator}
                  height={height}
                  sendRTCMessage={this.sendRTCMessage}
                  presenterID={this.presenterID}
                  myID={this.myID}
                  pcs={this.pcs}
                  lastMessage={this.lastMessage} />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={13}>
                <h4>
                  {this.isInitiator ? (<p>{this.texts.roleText}{this.texts.peerCountText}<Popup
                      trigger={<span>{Object.keys(this.pcs).length}</span>}
                      content={peernames}
                    /></p>) : <p>{this.texts.roleText}</p>}
                </h4>
                <div id="media" style={{'display': 'none'}}></div>
                <SpeechRecognition isInitiator={this.isInitiator}
                    speechRecognitionDisabled={this.speechRecognitionDisabled}
                    start={this.startSpeechrecognition}
                    sendRTCMessage={this.sendRTCMessage}
                    subtitle={this.subtitle} />
              </Grid.Column>
              <Grid.Column width={3}>
                <Button.Group vertical fluid>
                  {/*<a href={this.iframesrc.toLowerCase().replace('presentation','deck')} target="_blank"><Button content='Add comment to deck' labelPosition='right' icon='comment' primary/></a>{/*TODO open up the right functionality*/}*/}
                  <a href={this.iframesrc.toLowerCase().replace('presentation','deck')} target="_blank"><Button content='Edit current slide' labelPosition='right' icon='pencil' primary style={{textAlign: 'left'}}/></a>{/*TODO open up the right functionality*/}
                  {this.isInitiator ? (<Button content="Ask audience to complete a task" labelPosition='right' icon='travel' primary onClick={this.audienceCompleteTask.bind(this)}/>) : ''}
                  {(this.isInitiator) ? (
                    <Button content='Share this presentation' labelPosition='right' icon='share alternate' primary onClick={this.copyURLToClipboard.bind(this)}/>
                  ) : (
                    <Button content='Resume to presenter progress' style={(this.paused) ? {} : {display: 'none'}} labelPosition='right' icon='video play' color='red' onClick={this.resumePlayback.bind(this)}/>
                  )}
                </Button.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        );
    }
}

presentationBroadcast.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    getUser: React.PropTypes.func
};

presentationBroadcast = handleRoute(presentationBroadcast);

export default presentationBroadcast;
