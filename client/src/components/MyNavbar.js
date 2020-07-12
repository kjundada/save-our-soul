import React, { Component } from 'react';
import {
    Navbar,
    NavbarText
} from 'reactstrap';

class MyNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id: 'Feel better!'
    }
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