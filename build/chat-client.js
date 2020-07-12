    import {writePartnerMessage, writeSytemInfo, clear } from './chat-box'


    const socket = io(window.serverURI);
    const localVideo = document.querySelector('.localVideo'); 
    const remoteVideo = document.querySelector('.remoteVideo'); 
    let hasPartner = false;
    let peerConnection;
    let gettingUserMedia = false;
    
    /** @type {RTCConfiguration} */
    const config = {
        'iceServers': [{
        'urls': ['stun:stun.l.google.com:19302']
        }]
    };

    /** @type {MediaStreamConstraints} */
    const constraints = {
        audio: true,
        video: { facingMode: "user" }
    };

    socket.on('msg', writePartnerMessage);
    socket.on('sysinfo', handleSysInfo);
    socket.on('ready', function() {
        peerConnection = new RTCPeerConnection(config);
        peerConnection.addStream(localVideo.srcObject);

        peerConnection.createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(function () {
        socket.emit('ready', peerConnection.localDescription);
        });

        peerConnection.onaddstream = (event) => {
        remoteVideo.srcObject = event.stream;
        }
        peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            socket.emit('candidate', event.candidate);
        }
        };
    });


    socket.on('offer', function(description) {
        const peerConnection = new RTCPeerConnection(config);
        if (localVideo instanceof HTMLVideoElement) {
        peerConnection.addStream(localVideo.srcObject);
        }
        peerConnection.setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(function () {
        socket.emit('offer_ok', peerConnection.localDescription);
        });

        peerConnection.onaddstream = (event) => {
        remoteVideo.srcObject = event.stream;
        };
        peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            socket.emit('candidate', event.candidate);
        }
        };
    });

    socket.on('answer', function (description) {
        if (peerConnection) {
        peerConnection.setRemoteDescription(description);
        }
    });

    socket.on('candidate', function(candidate) {
        if (peerConnection) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    });

    socket.on('disconnect', handleSysInfo('server_disconnection'));

    tryVideoChat();

    export function nextPartner() {
        clear();
        disconnectFromPartner();
        socket.emit('next');
    }

    function disconnectFromPartner() {
        hasPartner = false;
        if (peerConnection && peerConnection.close) 
        peerConnection.close();
        peerConnection = null;
    }

    function getUserMediaSuccess(stream) {
        localMediaStream = stream;
        gettingUserMedia = false;
        if (localVideo instanceof HTMLVideoElement) {
        !localVideo.srcObject && (localVideo.srcObject = stream);
        }
    }  

    function getUserMediaError(error) {
        localMediaStream = null;
        console.log(err);
        gettingUserMedia = false;
        setTimeout(getUserMediaDevices, 1000);
    }

    function tryVideoChat() {
        if (localVideo instanceof HTMLVideoElement) {
            if (localVideo.srcObject) {
                getUserMediaSuccess(localVideo.srcObject);
            } else if (!gettingUserMedia && !localVideo.srcObject) {
                gettingUserMedia = true;
                navigator.mediaDevices.getUserMedia(constraints)
                .then(getUserMediaSuccess)
                .catch(getUserMediaError);
            }
        }
    }

    function handleSysInfo(code) {
        if( code == 'partner_connected')
            hasPartner = true;
        else if (code == 'partner_disconnected')
            disconnectFromPartner();
        else if (code == 'waiting_partner')
            hasPartner = false;
        writeSytemInfo(code);
    }

    export function sendMessage(msg) {
        if (hasPartner && msg.replace(/\s+/g, '').length > 0) {
            socket.emit('msg', msg);
            return true;
        }
        return false;
    }

