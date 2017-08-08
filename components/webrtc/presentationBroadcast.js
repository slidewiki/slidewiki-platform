import React from 'react';
import { handleRoute, navigateAction} from 'fluxible-router';
import { provideContext } from 'fluxible-addons-react';
import { isEmpty } from '../../common';
import { Grid, Message, Comment, Input, Button, Form, Divider } from 'semantic-ui-react';

class presentationBroadcast extends React.Component {

  /*
  * TODO add share button that copies the URL into the clipboard (down right corner)
  * TODO Use Username instead of "Peer X" if available
  * TODO Add some explaining texts for peers with swal or ToolTips(like that it's not a chat, ...)
  * TODO this.props.currentRoute.query.presentation is not filled correctly if a "#" is in the path
  */

    constructor(props) {
        super(props);
        this.texts = {roleText: '', peerCountText: '', peerCount: ''};
        this.isInitiator = false;
        this.localStream = undefined;
        this.myID = undefined;
        this.presenterID = undefined;
        this.pcs = {}; // {<socketID>: {RTCConnection: RPC, dataChannel: dataChannel}, <socketID>: {RTCConnection: RPC, dataChannel: dataChannel}}
        this.turnReady = undefined;

        this.pcConfig = {
            'iceServers': [{
                'urls': 'stun:stun.l.google.com:19302' //TODO host own STUN (and TURN?) Server? --> Socket.io is a stun server...What's this needed for?
            }]
        };

        this.room = this.props.currentRoute.query.room + '';//NOTE Error handling implemented in first lines of componentDidMount
        this.socket = undefined;

        //******** SlideWiki specific variables ********
        this.iframesrc = this.props.currentRoute.query.presentation + '';//NOTE Error handling implemented in first lines of componentDidMount
        this.lastRemoteSlide = this.iframesrc + '';
        this.paused = false; //user has manually paused slide transitions
        this.currentSlide = this.iframesrc + '';
        this.commentList = {};//{timestamp: {peer: username, message: text},timestamp: {peer: username, message: text}}
        this.subtitle = '';//used for speech recognition results
    }

    componentDidMount() {

        let that = this;
        if(isEmpty(that.iframesrc) || that.iframesrc === 'undefined' || isEmpty(that.room) || that.room === 'undefined'){
            console.log('Navigating away because of missing paramenters in URL');//TODO Maybe notify users in a more friendly way
            that.context.executeAction(navigateAction, {'url': '/'});
            return;
        }
        //Remove menus as they shouldn't appear
        $('.menu:first').remove();
        $('.footer:first').remove();

        that.socket = io('https://stunservice.experimental.slidewiki.org');//TODO remove hardcoded URL

        that.socket.emit('create or join', that.room);
        console.log('Attempted to create or join room', that.room);

        function setmyID() {
            if (that.myID === undefined)
                that.myID = that.socket.id;
            return that.myID;
        }

        that.socket.on('created', (room, socketID) => { //only initiator recieves this
            console.log('Created room ' + that.room);
            that.isInitiator = true;
            that.texts.roleText = 'You are the presenter. Other poeple will hear your voice and reflect your presentation progress. ';
            that.texts.peerCountText = 'People currently listening: ';
            that.texts.peerCount = 0;
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
            swal({
                title: '<p>Room <i>' + that.room + '</i> successfully created!</p>',
                html: '<p>Other people are free to join the room. Rooms are currently limited to 10 people. See the counter at the bottom of the page for information about currently listening people.</p>',
                type: 'info',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Check',
                allowOutsideClick: false
            }).then(() => { activateSpeechRecognition(); $('body>a#atlwdg-trigger').remove();});
        });

        that.socket.on('join', (room, socketID) => { //whole room recieves this, except for the peer that tries to join
            // a listener will join the room
            console.log('Another peer made a request to join room ' + room);
            if (that.isInitiator) {
                console.log('This peer is the initiator of room ' + that.room + '!');
                that.socket.emit('ID of presenter', that.room, that.myID);
            }
        });

        that.socket.on('joined', (room) => { //only recieved by peer that tries to join - a peer has joined the room
            console.log('joined: ' + that.room);
            setmyID();
            that.texts.roleText = 'You are now listening to the presenter and your presentation will reflect his actions.';
            that.forceUpdate();
            $('#slidewikiPresentation').on('load', activateIframeListeners);
            gotStream('');//NOTE Skip requesting streams for the listeners, as they do not need them
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
                allowOutsideClick: false
            });
        });

        that.socket.on('ID of presenter', (id) => {
            console.log('Received ID of presenter: ', id);
            that.presenterID = id;
        });

        that.socket.on('log', (array) => {
            setmyID();
        });

        ////////////////////////////////////////////////

        function sendMessage(cmd, data = undefined, receiver = undefined) {
            console.log('Sending message over socket: ', cmd, data, receiver);
            that.socket.emit('message', { 'cmd': cmd, 'data': data, 'sender': that.myID, 'receiver': receiver }, that.room);
        }

        function sendRTCMessage(cmd, data = undefined, receiver = undefined) {
            let message = JSON.stringify({ 'cmd': cmd, 'data': data, sender: that.myID });
            if (receiver) { //send to one peer only
                console.log('Sending message to peer: ', receiver);
                that.pcs[receiver].dataChannel.send(message);
            } else { //broadcast from initiator
                console.log('Broadcasting message to peers');
                for (let i in that.pcs) {
                    if (that.pcs[i].dataChannel)
                        that.pcs[i].dataChannel.send(message);
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
                console.log('Recieved message from peer: ', message);
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
                        that.pcs[message.sender].RTCconnection.addIceCandidate(candidate).catch((e) => {}); //Catch defective candidates, TODO add better exception handling
                    } catch (e) {}//TODO add better exception handling
                }
            }
        });

        //******** Media specific methods ********

        function requestStreams(options) {
            navigator.mediaDevices.getUserMedia(options)
                .then(gotStream)
                .catch((err) => {
                    console.log('getUserMedia() error: ' + err.name);
                });
        }

        function gotStream(stream) {
            console.log('Adding local stream');
            if (that.isInitiator) {
                //$('#media').append('<video id="localVideo" autoplay></video>');
                //let localVideo = document.querySelector('#localVideo');
                //localVideo.srcObject = stream;
                $('#media').remove();
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

        // if (location.hostname !== 'localhost') {
        //   requestTurn(
        //     'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
        //   );
        // }

        function start(peerID) {
            if (typeof that.localStream !== 'undefined') {
                console.log('creating RTCPeerConnnection for', (that.isInitiator) ? 'initiator' : 'peer');
                createPeerConnection(peerID);
                if (that.isInitiator){
                    that.pcs[peerID].RTCconnection.addStream(that.localStream);
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
                that.pcs[peerID].RTCconnection = new RTCPeerConnection(null);
                that.pcs[peerID].RTCconnection.onicecandidate = handleIceCandidate.bind(that, peerID);
                that.pcs[peerID].RTCconnection.onaddstream = handleRemoteStreamAdded;
                that.pcs[peerID].RTCconnection.onremovestream = handleRemoteStreamRemoved;
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
                    that.texts.peerCount = Object.keys(that.pcs).length;
                    that.forceUpdate();
                }
            } catch (e) {
                console.log('Failed to create PeerConnection, exception: ' + e.message);
                console.log('Cannot create RTCPeerConnection object.');
                swal({
                    title: 'An error occured',
                    html: 'We\'re sorry, but we can\'t connect you to the presenter. It seems like there is a problem with your connection or browser. Please update your browser, disable extensions or ask your network operator about it. We\'re using a peer to peer connection technique called WebRTC.',
                    type: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Okay',
                    allowOutsideClick: false
                }).then(() => {
                    cleanup();
                    that.context.executeAction(navigateAction, {'url': '/'});
                });
                return;
            }
        }

        function handleDataChannelEvent(peerID, event) { //called by peer
            console.log('ondatachannel:', event.channel);
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
                    allowOutsideClick: false
                });
                that.texts.roleText = 'This presentation has ended. Feel free to look at the deck as long as you want.';
                that.texts.peerCountText = '';
                that.texts.peerCount = '';
                that.forceUpdate();
                handleRemoteHangup(that.presenterID);
            }
        }

        function onDataChannelCreated(channel, peerID) { //called by peer and by initiatior
            console.log('Created data channel: ', channel, 'for ', peerID);
            /*NOTE
             * Browsers do currenty not support events that indicate whether ICE exchange has finished or not and the RPC connection has been fully established. Thus, I'm waiting for latest event onDataChannelCreated in order to close the that.socket after some time. This should be relativly safe.
             */
            if (!that.isInitiator && that.socket.disconnected === false) {
                setTimeout(() => { that.socket.close(); }, 5000); //close that.socket after 5 secs, TODO maybe come up with a better solution
            }

            channel.onopen = function() {
                console.log('Data Channel opened');
                if (that.isInitiator)
                    sendRTCMessage('gotoslide', document.getElementById('slidewikiPresentation').contentWindow.location.href, peerID);// using href instead of currentSlide because it could be bad initialized
            };

            channel.onmessage = handleMessage.bind(that, channel);
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
                remoteAudios[remoteAudios.length - 1].srcObject = event.stream;
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
                console.log('Error when deleteing RTC connections', e);
            } finally {
                if (that.isInitiator){
                    that.texts.peerCount = Object.keys(that.pcs).length;
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

        function handleMessage(channel, event) {
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
                    if (that.isInitiator)
                        addMessage(data);
                    break;
                case 'log':
                    console.log('Recieved log message from peer: ', data.data);
                    break;
                case 'bye':
                    handleRemoteHangup(data.data);
                    break;
                case 'subtitle':
                    handleSubtitle(data.data);
                    break;
                default:

            }
        }

        function requestTurn(turnURL) {//NOTE currently not used
            let turnExists = false;
            for (let i in that.pcConfig.iceServers) {
                if (that.pcConfig.iceServers[i].url.substr(0, 5) === 'turn:') {
                    turnExists = true;
                    that.turnReady = true;
                    break;
                }
            }
            if (!turnExists) {
                console.log('Getting TURN server from ', turnURL);
                // No TURN server. Get one from computeengineondemand.appspot.com:
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let turnServer = JSON.parse(xhr.responseText);
                        console.log('Got TURN server: ', turnServer);
                        that.pcConfig.iceServers.push({
                            'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
                            'credential': turnServer.password
                        });
                        that.turnReady = true;
                    }
                };
                xhr.open('GET', turnURL, true);
                xhr.send();
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

        $('#resumeRemoteControl').click(() => {
            that.paused = false;
            changeSlide(that.lastRemoteSlide);
        });

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

        function activateSpeechRecognition() {
            let recognition;
            let disabled = false;
            let final_transcript = '';

            let first_char = /\S/;

            function capitalize(s) {
                return s.replace(first_char, (m) => {
                    return m.toUpperCase();
                });
            }

            if (window.hasOwnProperty('webkitSpeechRecognition')) {
                recognition = new webkitSpeechRecognition();
            } else if (window.hasOwnProperty('SpeechRecognition')) {
                recognition = new SpeechRecognition();
            }

            if (recognition) {
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = navigator.language || navigator.userLanguage;
                recognition.maxAlternatives = 0;
                recognition.start();

                recognition.onresult = function (event) {

                    let interim_transcript = '';
                    if (typeof (event.results) == 'undefined') {
                        recognition.onend = null;
                        recognition.stop();
                        console.warn('error:', e);
                        //TODO implement error handling
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
                    console.log('Final text: ', final_transcript);
                    console.log('Interim text: ', interim_transcript);

                    let m = (final_transcript || interim_transcript);
                    sendRTCMessage('subtitle', m.substr((m.length-300) > 0 ? m.length-300 : 0, 300));
                };

                recognition.onerror = function (e) {
                    console.warn('Recognition error:', e);
                    recognition.stop();//TODO Really stop recognition in case of a fatal error. Pay attention to not restarting it via the onend listener
                };

                recognition.onend = function (e) {
                    if(!disabled){
                        console.warn('Recognition ended itself - stupid thing! Restarting ....', e);
                        recognition.start();
                    }
                };

                swal({
                    title: 'Speech recognition enabled',
                    html: '<p>Speech recognition is an experimental feature. If enabled, your voice will be transcoded and displayed at all peers as a subtitle.</p>',
                    type: 'info',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Okay',
                    cancelButtonText: 'Disable',
                    allowOutsideClick: false
                }).then(() => {}, (dismiss) => {
                    if (dismiss === 'cancel') {
                        disabled = true;
                        recognition.stop();
                        console.log('Recognition disabled');
                    }
                }).then(() => {
                    swal({
                        title: 'Invite others people',
                        html: '<p>Copy the following link and send it to other people in order to invite them to this room: <br/><br/><strong> ' + window.location.href + '</strong></p>',//TODO add a copy to clipboard button
                        type: 'info',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Okay',
                        allowOutsideClick: false
                    });
                });

                //TODO implement proper error handling
            } else {
                swal({
                    title: 'Speech recognition disabled',
                    html: '<p>Your browser isn\'t able to transcode speech to text. Thus, your peers will not recieve a subtitle. Google Chrome is currently the only browser that supports speech recognition.</p>',
                    type: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Okay',
                    allowOutsideClick: false
                });
            }
        }

        function addMessage(data, fromMyself = false) {
            let currentTime = new Date().getTime();
            that.commentList[currentTime] = {};
            if(!fromMyself)
                that.commentList[currentTime].peer = Object.keys(that.pcs).indexOf(data.sender);
            else
                that.commentList[currentTime].peer = 'Me';
            that.commentList[currentTime].message = data.data;
            that.forceUpdate();
        }
        that.addMessage = addMessage;

        function handleSubtitle(subtitle) {
            $('#input_subtitle').val(subtitle);
            $('#input_subtitle').animate({
                scrollLeft: $('#input_subtitle')[0].scrollLeft+1000
            }, 1000);
        }
    }

    componentDidUpdate() {}

    sendMessage(event) {
        event.preventDefault();
        this.sendRTCMessage('message', $('#messageToSend:first').val(), this.presenterID);
        this.addMessage({sender: this.myID, data: $('#messageToSend:first').val()}, true);
        return false;
    }

    render() {
        let messages = [];
        for(let i in this.commentList) {
            messages.push(
              <Message floating key={i}>
                <Comment.Group>
                  <Comment>
                    <Comment.Content>
                      <Comment.Author>{this.commentList[i].peer.toString() === 'Me' ? '' : 'Peer'} {this.commentList[i].peer.toString()}, {new Date(parseInt(i)).toLocaleTimeString('en-GB', { hour12: false, hour: 'numeric', minute: 'numeric'})}</Comment.Author>
                      <Comment.Text>
                        {this.commentList[i].message}
                      </Comment.Text>
                    </Comment.Content>
                  </Comment>
                </Comment.Group>
              </Message>);
        }

        return (
          <Grid celled='internally'>
            <Grid.Row>
              <Grid.Column width={13}>
                <iframe id="slidewikiPresentation" src={this.iframesrc}
                height={980*0.8 + 'px'} width="100%" frameBorder="0" style={{border: 0}}></iframe>{/*TODO Get window height for size*/}
              </Grid.Column>
              <Grid.Column width={3} style={{'overflowY': 'auto', 'whiteSpace': 'nowrap', 'maxHeight': 980*0.8 + 'px'}}>
                {(!this.isInitiator) ? (
                  <Grid columns={1}>
                    <Grid.Column id="messageList" style={{'overflowY': 'auto', 'whiteSpace': 'nowrap', 'maxHeight': 500 + 'px'}}>
                      <h3>Your Questions:</h3>
                      {messages}
                    </Grid.Column>
                    <Grid.Column>
                      <Divider clearing />
                      <Form reply>
                        <Form.TextArea id="messageToSend" placeholder='Ask a question...' maxLength="300"/>
                        {/*
                          * TODO Add a visible char counter,e .g. 234/300 next to the send button
                          * TODO Don't send empty messages or those with too few words (and show notification about it)
                          * TODO move the input box to the bottom of the element (so it doesn't move)
                          * TODO disable keydown listener if textarea is focused
                          */}
                        <Button content='Send' labelPosition='right' icon='upload' primary onClick={this.sendMessage.bind(this)}/>
                      </Form>
                    </Grid.Column>
                  </Grid>
                ) : (
                  <div id="messageList"><h3>Messages from peers:</h3>{messages}</div>
                )}
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={16}>
                <h4>{this.texts.roleText}{this.texts.peerCountText}{this.texts.peerCount}</h4>
                <button id="resumeRemoteControl" style={(this.paused) ? {} : {display: 'none'}}>Resume</button>
                <div id="media" style={{'display': 'none'}}></div>
                {(!this.isInitiator) ? (
                  <div>
                    <b>Speech recognition:</b>{/*TODO Find a better heading and add a boarder to the input*/}
                    <Input fluid transparent id="input_subtitle" />
                  </div>
                ) : ''}
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
