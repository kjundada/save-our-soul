import React from 'react';
import MDSpinner from 'react-md-spinner';
import UserImage from '../img/user.jpg'

export default function MessageList({isLoading, messages, user, renderMessage}) {
  
  let chatContent = (
    <div className='loading-messages-container'>
      <MDSpinner size='100' singleColor="grey"/>
      <span className='loading-text'>Loading Messages</span>
    </div>
  );

  if (!isLoading && messages.length) {
    return messages.map(message => {
      if (renderMessage){
        return renderMessage(message);
      }
      else {
        let isUser = user.uid === message.sender.uid;
        let isSys = message.sender.uid === "sys";
    
        let renderName;
        if (isUser) {
          renderName = null;
        } else {
          renderName = <div className='sender-name'>{message.sender.name}</div>;
        }

        return (
            isSys ? (
              <div
              key={message.id}
              className='chat-bubble-row'
              style={{flexDirection: 'row'}}>
                <div
                  className='message chat-bubble is-sys'
                  style={{color: '#2D313F'}}>
                  {message.text}
                </div>
              </div>
            )
            : (
              <div
                key={message.id}
                className='chat-bubble-row'
                style={{flexDirection: isUser ? 'row-reverse' : 'row'}}>
                <img
                  src = {UserImage}
                  alt='sender avatar'
                  className='avatar'
                  style={isUser ? {marginLeft: '15px'} : {marginRight: '15px'}}
                />
                <div className={`chat-bubble ${isUser ? 'is-user' : 'is-other'}`}>
                  {renderName}
                  <div
                    className='message'
                    style={{color: isUser ? '#FFF' : '#2D313F'}}>
                    {message.text}
                  </div>
                </div>
              </div>
            )
        );
      }
    });
  }
  return chatContent;
}
