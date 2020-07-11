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
              <NavbarBrand className="brand" href="/">SaveOurSoul</NavbarBrand>
              <NavbarText className="ml-auto">{this.state.id}</NavbarText>
          </Navbar>
      </div>
    );
  }
}

export default MyNavbar;