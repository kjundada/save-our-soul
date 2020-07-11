import io from "socket.io-client";
import {clear, writePartnerMessage, writeSytemInfo} from './chat-box';
const socket = io('http://localhost:4000');
let localVideo = document.getElementById('localVideo'); //your video element
let remoteVideo = document.getElementById('remoteVideo'); //remote video element
let hasPartner = false;
let isVideoChat = true;
let partnerIsStreaming = false;
let peerConnection;
let getUserMediaAttempts = 5;

/** @type {RTCConfiguration} */
const config = {
  'iceServers': [{
    'urls': ['stun:stun.l.google.com:19302']
  }]
};

/** @type {MediaStreamConstraints} */
const constraints = {
  // audio: true,
  video: { facingMode: "user" }
};

socket.on('msg', writePartnerMessage);
socket.on('sysinfo', handleSysInfo);


socket.on('ready', function() {
  console.log("Client is getting ready", localVideo, remoteVideo);
  peerConnection = new RTCPeerConnection(config);

  peerConnection.addStream(localVideo.srcObject);

  peerConnection.createOffer()
  .then(sdp => peerConnection.setLocalDescription(sdp))
  .then(function () {
    console.log("client emitting offer", peerConnection.localDescription);
    socket.emit('ready', peerConnection.localDescription);
  });

  peerConnection.onaddstream = (event) => {
    remoteVideo.srcObject = event.stream;
    console.log("Setting remote video stream");
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

  // @ts-ignore
  peerConnection.onaddstream = (event) => {
    remoteVideo.srcObject = event.stream;
    console.log("Setting remote video stream");
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
socket.on('disconnect', handleServerDisconnection);


export function nextPartner() {
  clear();
  disconnectFromPartner();
  socket.emit('next');
  console.log("Emitted next");
}

function sendLocalInfo() {
  socket.emit('info', {isVideoChat: isVideoChat})
}

function handleServerDisconnection() {
  handleSysInfo('server_disconnection');
}

function disconnectFromPartner() {
  hasPartner = false;
  if (peerConnection && peerConnection.close) peerConnection.close();
  peerConnection = null;
  partnerIsStreaming = false;
}


function handleSysInfo(code) {
  switch (code) {
    case 'partner_connected':
      hasPartner = true;
      break;
    case 'partner_disconnected':
      disconnectFromPartner();
      break;
    case 'waiting_partner':
      sendLocalInfo();
      hasPartner = false;
      break;
    default:
  }
  writeSytemInfo(code);
}


export function sendMessage(msg) {
  if (hasPartner && msg.replace(/\s+/g, '').length > 0) {
    socket.emit('msg', msg);
    return true;
  }
  return false;
}

