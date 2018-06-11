import React, { Component } from 'react';
import './RecordRemote.css';

export default class RecordRemote extends Component {

    render() {
        return (
            <div className="remotes__records">
                {
                    this.props.recording ?
                        [
                            <button onClick={this.props.stopRecording}>Stop recording</button>,
                            <span className="time-ticker">{this.props.recordTime}</span>
                        ] :
                        <button onClick={this.props.startRecording}>Start recording</button>
                }
            </div>
        );
    }
}