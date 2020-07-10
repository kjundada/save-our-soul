import React, { Component } from 'react';
import {

} from 'reactstrap';

class ConnectedPage extends Component {
    render() {
        return (
            <div className="main-container mt-2">
                <div className="box-1">
                    <img className="video" src={require('../img/sample.jpg')} width="100%" height="100%" />
                </div>
                <div className="box-2">
                    <img className="video" src={require('../img/sample.jpg')} width="100%" height="100%" />
                </div>
                <div className="chat">
                    Heyy 
                </div>
            </div>
        );
    }
}

export default ConnectedPage;