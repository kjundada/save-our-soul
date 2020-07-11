import React, {useState} from 'react';
import {} from 'reactstrap';
import { useLocation} from "react-router-dom";
import io from "socket.io-client";
import ChatBox from "./ChatBox";
import MyNavbar from "./MyNavbar";
let socket;

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

export default function ConnectedPage() {
  const query = new URLSearchParams(useLocation().search);
  const info = {op: query.get('op'), problem: query.get('problem')};
  let localVideo;
  let remoteVideo;
  let peerConnection;
  let partnerIsStreaming = false;
  let [hasPartner, setHasPartner] = useState(false);
  let [messages, setMessages] = useState([]);


  React.useEffect(()=>{
    socket = io('http://localhost:4000');
    localVideo = document.getElementById('localVideo');
    remoteVideo = document.getElementById('remoteVideo');

    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => localVideo.srcObject = stream)
    .catch(err => console.log(err));

    socket.on('sysinfo', sendLocalInfo);

    socket.on('msg', function(msg) { //whenever a msg is recieved by the client
      // write the partner's message to the list
      messages.push({ 
        "text": msg.content,
        "id": messages.length+1,
        "sender": { "name": "Stranger", "uid": "user2"},
      });
      setMessages(messages);
    });


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
        handleSysInfo('partner_connected');
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
        handleSysInfo('partner_connected');
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

    }, [])


  function clear(){
    setMessages([]); //clear messages
  }

  function addSysLog(msg) {
    console.log(msg);

    messages.push({ 
      "text": msg,
      "id": messages.length+1,
      "sender": { "name": "System", "uid": "sys",},
    });
    setMessages(messages);
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

  function sendMessage(msg) {
    if (hasPartner && msg.replace(/\s+/g, '').length > 0) {
      socket.emit('msg', msg);
      messages.push({ 
        "text": msg,
        "id": messages.length+1,
        "sender": { "name": "Me", "uid": "user1",},
      });
      setMessages(messages);
      return true;
    }
    else {
      addSysLog("You cannot chat without a partner!");
      return false;
    }
  }

  function nextPartner() {
    //     handleSysInfo('partner_disconnected');
    disconnectFromPartner();
    handleSysInfo('waiting_partner');
    socket.emit('next');
  }

  function disconnectFromPartner() {
    setHasPartner(false);
    if (peerConnection && peerConnection.close) peerConnection.close();
    peerConnection = null;
    partnerIsStreaming = false;
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



  return (
    <div>
      <MyNavbar/>
      <div className="row">
        <div className="column chat-column">
          <ChatBox sendMessage={sendMessage} messages={messages} isLoading={false}/>
        </div>
        <div className="column video-column">
          <div className="main-container mt-2">
            <video id="localVideo" playsInline autoPlay></video>
            <video id="remoteVideo" playsInline autoPlay></video>
            <button onClick={nextPartner} >next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
