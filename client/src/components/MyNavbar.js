import React, { Component } from 'react';
import {
    Navbar,
    NavbarBrand,
    NavbarText
} from 'reactstrap';

class MyNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        id: 'Welcome!'
    }
  }
  render() {
    return (
      <div>
          <Navbar color="light" light fixed="top">
              <NavbarText className="ml-auto">
                <div className="online-count">
                  <strong>x</strong> online now
                </div>
              </NavbarText>
              
              <NavbarBrand className="brand" href="/">SaveOurSoul</NavbarBrand>
              <NavbarText className="ml-auto">{this.state.id}</NavbarText>
          </Navbar>
          <br/>
          <br/>
      </div>
    );
  }
}

export default MyNavbar;