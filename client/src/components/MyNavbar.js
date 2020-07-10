import React, { Component } from 'react';
import {
    Navbar,
    NavbarBrand,
    NavbarText
} from 'reactstrap';

class MyNavbar extends Component {
    render() {
        return (
            <div>
                <Navbar color="dark" dark>
                    <NavbarBrand className="brand" href="/">SaveOurSoul</NavbarBrand>
                    <NavbarText className="ml-auto">To Be Added</NavbarText>
                </Navbar>
            </div>
        );
    }
}

export default MyNavbar;