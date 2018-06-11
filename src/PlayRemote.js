import React, { Component } from 'react';
import './PlayRemote.css';

export default class PlayRemote extends Component {

    render() {
        return (
            <div className="remotes__play">
                <button disabled={this.props.playing} onClick={this.props.play}>Play</button>
                <button disabled={this.props.paused} onClick={this.props.pause}>Pause</button>
                <button disabled={!this.props.playing && !this.props.paused} onClick={this.props.stop}>Stop</button>
            </div>
        );
    }
}