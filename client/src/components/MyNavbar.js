import React, { Component } from 'react';
import {
    Navbar,
    NavbarText
} from 'reactstrap';

const messagesList = [
  'Feel better!', 
  'Stay positive! 😁', 
  'Quarantine will end soon!',
  'It will pass. ⌛', 
  'You will feel better.',
  'More power to you! 💪',
  'We will get through this.',
  'This too shall pass!!', 
  'Believe in yourself...', 
  'Love yourself...🧡', 
  'We are here for you! 😌', 
  'Corona Virus will end!',
  'We will meet our friends soon. ',
  'We are in this together', 
  'You are not alone!!! 💞',
]

class MyNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: messagesList[0]
    }
  }

  componentDidMount() {
    setInterval(()=> {
      const randIndex = Math.floor(Math.random() * messagesList.length);
      this.setState({id: messagesList[randIndex]})
    }, 10000)
  }

  render() {
    return (
      <Navbar className="navbar-main" light fixed="top">
          
          <NavbarText className="ml-left">{this.state.id}</NavbarText>
          
          <p className="brand-aaa" href="/">SaveOurSoul</p>
          
          <NavbarText >
            <div className="online-count">
              <strong>x</strong> online now
            </div>
          </NavbarText>
          
      </Navbar>
    );
  }
}

export default MyNavbar;