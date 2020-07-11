import 'react-chatbox-component/dist/style.css';
import MessageList from './MessageList';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: this.props.messages,
      user: this.props.user
    };
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollToBottom();
  }

  handleSendMessage = event => {
    event.preventDefault();
    const {message} = this.state;
    this.onSubmit(message);
    this.setState({message: ''});
  };
  scrollToBottom = () => {
    const chat = document.getElementById('end-of-chat');
    chat.scrollIntoView();
  };

  onSubmit = (message) => {
        this.props.messages.push({ 
            "text": message,
            "id": this.props.messages.length+1,
            "sender": {
            "name": "Stranger",
            "uid": this.state.user.uid,
            },
        });
}
awaein= (messages) =>{console.log(messages)}
  render() {
    let {isLoading, user, renderMessage, messages} = this.props;
    let {message} = this.state;
    this.awaein(messages)
    return (
        
            <div className='chat-box'>
              <div className='msg-page'>
                <MessageList
                  isLoading={isLoading}
                  messages={messages} 
                  user={user}
                  renderMessage={renderMessage}
                />
                <div className='chat-box-bottom'>
                  <div id='end-of-chat'></div>
                </div>
              </div>
              <div className='msg-footer'>
                <form
                  className='message-form'
                  onSubmit={this.handleSendMessage}>
                  <div className='input-group'>
                    <input
                      type='text'
                      className='form-control message-input'
                      placeholder='Type something'
                      value={message}
                      onChange={event => this.setState({ message: event.target.value})}
                      required
                    />
                  </div>
                </form>
              </div>
            </div>
    );
  }
}

ChatBox.propTypes = {
  messages: PropTypes.array,
  onSubmit: PropTypes.func,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  renderMessage: PropTypes.func,
  typingListener: PropTypes.func,
  typingIndicator: PropTypes.element,
};


ChatBox.defaultProps = {
  messages: [{
    "text": "Hello there",
    "id": "1",
    "sender": {
      "name": "Ironman",
      "uid": "user1",
    },
  },{
    "text": "Hello there",
    "id": "1",
    "sender": {
      "name": "Ironman",
      "uid": "user2",
    },
  },],

  user: {
    "uid": "user1"
  },
  isLoading: false,
};

export default ChatBox;