import React, { useState } from 'react';
import {} from 'reactstrap';
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import ChatBox from "./ChatBox";
import MyNavbar from "./MyNavbar";
import deepai from "deepai";

deepai.setApiKey('bc5faa9f-b64f-46fb-a1a3-3f577fd12f1c');

let socket;
let localVideo;
let remoteVideo;
let peerConnection;
let messagesAll = [];


/** @type {RTCConfiguration} */
const config = {
'iceServers': [{
    'urls': ['stun:stun.l.google.com:19302', 
    'stun:stun1.l.google.com:19302', 
    'stun:stun2.l.google.com:19302',
    'stun:stun3.l.google.com:19302']
}]
};

/** @type {MediaStreamConstraints} */
const constraints = {
  // audio: true,
  video: { facingMode: "user" }
};

export default function ConnectedPage() {
  const query = new URLSearchParams(useLocation().search);
  const info = {op: query.get('op'), problem: query.get('problem')};
  let [hasPartner, setHasPartner] = useState(false);
  let [messages, setMessages] = useState([]);

  React.useEffect(()=>{
    socket = io(window.serverURI);
    localVideo = document.getElementById('localVideo');
    remoteVideo = document.getElementById('remoteVideo');
    localVideo.volume = 0;
    remoteVideo.volume = 0;

    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => localVideo.srcObject = stream)
    .catch(err => console.log(err));
    
    nextPartner();

    socket.on('sysinfo', handleSysInfo);

    socket.on('msg', addPartnerMsg);

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
        console.log(event);
        remoteVideo.srcObject = event.stream;
        console.log("Setting remote video stream");
        // handleSysInfo('partner_connected');
      }

      peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
          socket.emit('candidate', event.candidate);
        }
      };
    });

    socket.on('offer', function(description) {
      console.log(description);
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

        // handleSysInfo('partner_connected');
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

    socket.on('disconnect', () => handleSysInfo('server_disconnection'));

    socket.on('leaving', () => handleSysInfo('partner_disconnected'));

    }, [])


  function clear(){
    messagesAll = [];
    setMessages([]); //clear messages
  }

  function addSysLog(msg) {
    console.log(msg);
    messagesAll = [...messagesAll, { 
      "text": msg,
      "id": messages.length+1,
      "sender": { "name": "System", "uid": "sys",},
    }]
    setMessages(messagesAll);
  }

  function writeSytemInfo(code) {
    switch (code) {
      case 'partner_connected':
        clear();
        addSysLog('You\'re now chatting with a random stranger. Say hi!');
        break;
      case 'waiting_partner':
        addSysLog('Looking for someone you can talk to...');
        break;
      case 'partner_disconnected':
        addSysLog('Sorry. stranger has disconnected.');
        addSysLog('Click on next to start a new chat.');
        break;
      case 'server_disconnection':
        addSysLog('System error! Please refresh this page!');
        break;
      default:
        addSysLog(code);
        break;
    }
  }  

  function addPartnerMsg(msg) { //whenever a msg is recieved by the client
    // write the partner's message to the list
    messagesAll = [...messagesAll, { 
      "text": msg.content,
      "id": messages.length+1,
      "sender": { "name": "Stranger", "uid": "user2"},
    }]
    setMessages(messagesAll);
  }

  function sendMessage(msg) {
    if (hasPartner && msg.replace(/\s+/g, '').length > 0) {
      socket.emit('msg', msg);
      messagesAll = [...messages, { 
        "text": msg,
        "id": messages.length+1,
        "sender": { "name": "Me", "uid": "user1",},
      }]
      setMessages(messagesAll);
      return true;
    }
    else {
      addSysLog("You cannot chat without a partner!");
      return false;
    }
  }

  function nextPartner() {
    disconnectFromPartner();
    sendLocalInfo();
    setHasPartner(false);
    socket.emit('next');
  }

  function disconnectFromPartner() {
    setHasPartner(false);
    if (peerConnection && peerConnection.close) peerConnection.close();
    peerConnection = null;
    socket.emit('leaving');
  }

  function sendLocalInfo(){
    socket.emit('info', info)
  }

  function handleSysInfo(code) {
    switch (code) {
      case 'partner_connected':
        setHasPartner(true);
        console.log("Found a partner");
        break;
      case 'partner_disconnected':
        disconnectFromPartner();
        break;
      case 'waiting_partner':
        sendLocalInfo();
        setHasPartner(false);
        break;
      default:
        console.log("Invalid code");
        break;
    }
    writeSytemInfo(code);
  }


  async function report(){
    if (hasPartner) {
      console.log("Reporting your partner");
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = remoteVideo.videoWidth;
      canvas.height = remoteVideo.videoHeight;
      ctx.drawImage(remoteVideo, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);      


      deepai.callStandardApi("content-moderation", {
        image: imageData,
      }).then(response => {
        console.log(response);
        const nsfw_score = Number(response.output.nsfw_score);
        if (nsfw_score >= 0.6){
          alert(`Reporting. Found content consisting of nudity in partner's stream (nsfw score: ${nsfw_score.toFixed(3)}).`);
          nextPartner();
        }
        else {
          alert(`Invalid report. Moderated content. ${nsfw_score.toFixed(3)}`);
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  }


  return (        
    <div className="conn">
        <div className="row" >
          <MyNavbar/>
        </div>
        <br/>
        <br/>
        <div className="row" >
          <div className = "column chat-column">
            <ChatBox className= "chat-column" sendMessage={sendMessage} messages={messages} isLoading={false}/>
          </div>
          <div className = "column video-column">
            <div className="row video-row" >
              <video className = "vid" id="remoteVideo" style={{display: hasPartner ? 'block' : 'none'}} playsInline autoPlay muted></video>
              {
                !hasPartner && <div className="vid" id="videoPlaceholder">
                  <img id="loadingGif" src="https://cdn.dribbble.com/users/1303437/screenshots/4952713/attachments/1110126/abstract-loader-white.gif" alt="loading"/>
                </div>
              }
              <video className = "vid" id="localVideo" playsInline autoPlay muted></video>
            </div>
            <div className="row button-row" >
              <button className="button" onClick={nextPartner} >
                <i className="fa fa-arrow-circle-right button-left-icon"></i>
                Next
              </button>
              <button className="button" onClick={report} >
                <i className="fa fa-flag button-left-icon" style={{fontSize: 'medium'}}></i>
                Report
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
