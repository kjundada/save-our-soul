import React from 'react';
import $ from 'jquery'; 
import io from "socket.io-client";

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

export default function Chat() {
  let socket;
  let localVideo;
  let remoteVideo;
  let peerConnection;
  let hasPartner = false;
  let isVideoChat = true;
  let partnerIsStreaming = false;
  let $box;
  let $message;
  let $controlBtn;


  React.useEffect(()=>{
    socket = io('http://localhost:4000');
    console.log(socket, " socket connection established.");
    localVideo = document.getElementById('localVideo');
    remoteVideo = document.getElementById('remoteVideo');
    $box = $('#conversation-box');
    $message = $('#textmessage');
    $controlBtn = $('#control');


    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => localVideo.srcObject = stream)
    .catch(err => console.log(err));

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

  }, [])

  function clear() {
    $box.html('');
    $message.html('');
  }

  function writeSytemInfo(code) {
    let $syslog = $('<div class="sys-info"></div>');

    switch (code) {
      case 'partner_connected':
        clear();
        $syslog.append('<p class="syslog"><strong>You\'re now chatting with a random stranger. Say hi!</strong></p>');
        break;
      case 'waiting_partner':
        $syslog.append('<p class="syslog"><strong>Looking for someone you can talk to...</strong></p>');
        break;
      case 'partner_disconnected':
        $syslog.append('<p class="syslog"><strong>Sorry. stranger has disconnected.</strong></p>');
        $syslog.append('<p class="syslog"><strong>Click on <span class="special">next</span> to start a new chat.</strong></p>');
        break;
      case 'server_disconnection':
        $syslog.append('<p class="syslog error"><strong>System error! Please refresh this page!</strong></p>');
        break;
      default:
        $syslog.append(code);
        break;
    }
    $box.append($syslog);
    $box.scrollTop($box.prop('scrollHeight'));
  }

  function writePartnerMessage(msg) {
    let msgText = document.createTextNode(' ' + msg.content);
    let $userlog = $('<p class="userlog stranger"></p>');
    $userlog.append('<span class="name">Stranger</span>');
    $userlog.append(msgText);
    $box.append($userlog);
    $box.scrollTop($box.prop('scrollHeight'));
  }


  function handleChatButtonClick() {
    let message = $message.val();
    if (sendMessageChatClient(message)) {
      let msgText = document.createTextNode(' ' + message);
      let $userlog = $('<p class="userlog me"></p>');
      $userlog.append('<span class="name">You</span>');
      $userlog.append(msgText);
      $box.append($userlog);
      $box.scrollTop($box.prop('scrollHeight'));
      $message.val('');
      handleStartClick(true);
    }
  }
  

  function handleStartClick(reset){
    console.log("control clicked!");
    let current = $controlBtn.attr('data-current');
    if (reset === true) {
      $controlBtn.text('next');
      $controlBtn.attr('data-current', 'next');
      $controlBtn.removeClass('red');
    } else if (current === 'start' || current === 'really') {
      $controlBtn.text('next');
      $controlBtn.attr('data-current', 'next');
      $controlBtn.removeClass('red');
      nextPartner();
    } else {
      $controlBtn.text('really?');
      $controlBtn.attr('data-current', 'really');
      $controlBtn.addClass('red');
    }
  }

  function nextPartner() {
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


  function sendMessageChatClient(msg) {
    if (hasPartner && msg.replace(/\s+/g, '').length > 0) {
      socket.emit('msg', msg);
      return true;
    }
    return false;
  }


  return (
    <div>
        {/* <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <div className="header">
          <div className="container">
            <div className="logo">
              <a href="./"><img src="img/logo.png" width="75px" alt="Save Our Soul"/></a>
            </div>
            <button className="btn green" id="control" onClick={handleStartClick} >start</button>
            <div className="online-count">
              <strong>x</strong> online now
            </div>
          </div>
        </div>
        <div className="container main">
          <div className="chat">
            <div className="video">
              <video id="localVideo" playsInline autoPlay></video>
              <video id="remoteVideo" playsInline autoPlay></video>
            </div>
            <div className="text basic-shadow">
                <div className="conversation-box" id="conversation-box">
                  <p className="syslog"><strong>Hi, welcome to <span className="special">Save Our Soul</span>!</strong></p>
                  <p></p>
                </div>
                <div className="write-box">
                  <textarea name="message" id="textmessage"></textarea>
                  <button className="btn" onClick={handleChatButtonClick}>send</button>
                </div>
            </div>
          </div>
        </div> */}
    </div>

  );
}