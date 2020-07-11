import React from 'react';
import '../api/chat-box';
import $ from 'jquery'; 
import {nextPartner, sendMessage as sendMessageChatClient, tryVideoChat} from '../api/chat-client';

export default function Chat() {
  let $box = $('.conversation-box');
  let $message = $('.write-box>textarea');
  let $controlBtn = $('#control');
  $message.on('keydown', function(e) {
    if (e.which == 13) sendMessage();
  });
  $(document).on('keyup', function(e) {
    if (e.which == 27) $controlBtn.click();
  });
  
  tryVideoChat();



  function clear() {
    $box.html('');
    $message.html('');
  }

  function sendMessage() {
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
    sendMessage();
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
            <button className="btn green" onClick={handleStartClick} >start</button>
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
                  <p className="syslog"><strong>Click on the <span className="special">start</span> button (on top bar) or press <span className="special">ESC</span> and <i>have a nice chatting!</i></strong></p>
                  <p></p>
                </div>
                <div className="write-box">
                  <textarea name="message"></textarea>
                  <button className="btn" onClick={handleChatButtonClick}>send</button>
                </div>
            </div>
          </div>
        </div>
    </div>

  );
}