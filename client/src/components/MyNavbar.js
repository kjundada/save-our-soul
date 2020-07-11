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
              
              <NavbarText className="ml-left">{this.state.id}</NavbarText>
              <p className="brand-aaa" href="/">SaveOurSoul</p>
              
              <NavbarText >
                <div className="online-count">
                  <strong>x</strong> online now
                </div>
              </NavbarText>
              
          </Navbar>
          <br/>
          <br/>
      </div>
    );
  }
}

export default MyNavbar;