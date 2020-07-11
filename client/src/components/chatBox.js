/*import 'react-chatbox-component/dist/style.css';
import { ChatBox } from 'react-chatbox-component';
import React, { Component } from 'react';

class chatBox extends Component {

    constructor(props){
        super(props);
        this.state = {
            messages : [],
            user :"",
        }
    }
   messages = [{
    "text": "Hello there",
    "id": "1",
    "sender": {
      "name": "Ironman",
      "uid": "user1",
    },
  }, {
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
      "uid": "user1",
    },
  },{
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
      "uid": "user1",
    },
  },{
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
      "uid": "user1",
    },
  },{
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
      "uid": "user1",
    },
  },{
    "text": "Hello there",
    "id": "1",
    "sender": {
      "name": "Ironman",
      "uid": "user1",
    },
  },]
   user = {
    "uid": "user2"
  }
  onsubmit = e =>{
        
       /*this.setState(state => {

            const messages = state.messages.concat({ 
                "text": "Hello there",
                "id": "1",
                "sender": {
                  "name": "Ironman",
                  "uid": "user1",
                },
              });
            return {
            messages,
            };
        }
        );
        
    };
  render=()=> {
    return ( <div className = 'container' style = { { maxWidth: '800px',  paddingTop: '100px' } } >
      <div className = 'chat-header' >
      <h5 > Chat with a Stranger </h5> </div>
      <ChatBox bgcolor='#000000' messages = {this.messages}  user = { this.user } onSubmit = {this.onsubmit()}  typingIndicator = {true} /> </div>
    )
  }
} export default chatBox*/
//;
import 'react-chatbox-component/dist/style.css';
import MessageList from './MessageList';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
class ChatBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.message !== this.state.message && this.props.typingListener) {
      this.props.typingListener();
    }
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
    
        this.setState(state => {
        const len = state.messages.length
        const messages = state.messages.concat({ 
            "text": message,
            "id": len+1,
            "sender": {
            "name": "Stranger",
            "uid": this.uid,
            },
        });
        return {
        messages,
        };
    }, (m)=> this.setState(messages= {m} )
    );
    console.log(this.messages)
}

  render() {
    let {messages, isLoading, user, renderMessage} = this.props;
    let {message} = this.state;

    return (
        
            <div className='chat-box'>
              <div className='msg-page'>
              <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
                <MessageList
                  isLoading={isLoading}
                  messages={messages} 
                  user={user}
                  renderMessage={renderMessage}
                />
                <div className='chat-box-bottom'>
                  { this.props.typingIndicator?this.props.typingIndicator:'' }
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
  },],
  user: {
    "uid": "user1"
  },
  isLoading: false,
  
};

export default ChatBox;