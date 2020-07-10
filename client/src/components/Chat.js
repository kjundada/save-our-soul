import React from 'react';
// import '../api/chat-box';
// import '../api/chat-client';

export default function Chat() {
  return (
    <div>
        <div class="header">
          <div class="container">
            <div class="logo">
              <a href="./"><img src="img/logo.png" width="75px" alt="Omigo"/></a>
            </div>
            <button class="btn green" type="button" name="action" id="control" data-current="start">start</button>
            <div class="online-count">
              <strong>x</strong> online now
            </div>
          </div>
        </div>
        <div class="container main">
          <div class="chat">
            <div class="video">
              <video class="localVideo" playsinline autoplay></video>
              <video class="remoteVideo" playsinline autoplay></video>
            </div>
            <div class="text basic-shadow">
                <div class="conversation-box" id="conversation-box">
                  <p class="syslog"><strong>Hi, welcome to <span class="special">omigo</span>!</strong></p>
                  <p></p>
                  <p></p>
                  <p class="syslog"><strong>omigo</strong> (oh·me·goal) is a great way to meet new friends.</p>
                  <p class="syslog">When you use omigo, we pick someone else at random and let you talk one-on-one.</p>
                  <p class="syslog">To help you stay safe, chats are anonymous unless you tell someone who you are (not suggested!),</p>
                  <p class="syslog">and you can stop a chat at any time.</p>
                  <p class="syslog">If you can't be nice, please don't use omigo.</p>
                  <p></p>
                  <p></p>
                  <p class="syslog"><strong>Click on the <span class="special">start</span> button (on top bar) or press <span class="special">ESC</span> and <i>have a nice chatting!</i></strong></p>
                  <p></p>
                </div>
                <div class="write-box">
                  <textarea name="message"></textarea>
                  <button class="btn" type="button" name="button">send</button>
                </div>
            </div>
          </div>
        </div>
    </div>

  );
}