import React from 'react';
import '../api/chat-box';
import {tryVideoChat} from '../api/chat-client';

export default function Chat() {
  tryVideoChat();
  return (
    <div>
        <br/>
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
            <button className="btn green" type="button" name="action" id="control" data-current="start">start</button>
            <div className="online-count">
              <strong>x</strong> online now
            </div>
          </div>
        </div>
        <div className="container main">
          <div className="chat">
            <div className="video">
              <video className="localVideo" playsInline autoPlay></video>
              <video className="remoteVideo" playsInline autoPlay></video>
            </div>
            <div className="text basic-shadow">
                <div className="conversation-box" id="conversation-box">
                  <p className="syslog"><strong>Hi, welcome to <span className="special">Save Our Soul</span>!</strong></p>
                  <p></p>
                  <p></p>
                  <p className="syslog"><strong>Save Our Soul</strong> (oh·me·goal) is a great way to meet new friends.</p>
                  <p className="syslog">When you use Save Our Soul, we pick someone else at random and let you talk one-on-one.</p>
                  <p className="syslog">To help you stay safe, chats are anonymous unless you tell someone who you are (not suggested!),</p>
                  <p className="syslog">and you can stop a chat at any time.</p>
                  <p className="syslog">If you can't be nice, please don't use Save Our Soul.</p>
                  <p></p>
                  <p></p>
                  <p className="syslog"><strong>Click on the <span className="special">start</span> button (on top bar) or press <span className="special">ESC</span> and <i>have a nice chatting!</i></strong></p>
                  <p></p>
                </div>
                <div className="write-box">
                  <textarea name="message"></textarea>
                  <button className="btn" type="button" name="button">send</button>
                </div>
            </div>
          </div>
        </div>
    </div>

  );
}