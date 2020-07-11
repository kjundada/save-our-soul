import React, { Component } from 'react';
import {

} from 'reactstrap';

class ConnectedPage extends Component {
    render() {
        return (
            <div className="main-container mt-2">
                <div className="box-1">
                    <video className="remoteVideo" playsinline autoplay></video>
                </div>
                <div className="box-2">
                    <video className="localVideo" playsinline autoplay/>
                </div>
                <div className="chat">
                    Heyy 
                </div>
            </div>
        );
    }
}

export default ConnectedPage;