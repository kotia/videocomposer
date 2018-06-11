import React, { Component } from 'react';
import './App.css';

export default class Video extends Component {
    constructor(props) {
        super(props);
        this.videoEl = React.createRef();
        this.listener = undefined;
    }

    play() {
        this.videoEl.play();
        this.listener = this.videoEl.addEventListener('ended', () => {
            this.props.playFinished();
        });
    }

    replay() {
        this.videoEl.pause();
        this.videoEl.currentTime = 0;
        this.play();
    }

    pause() {
        this.videoEl.pause();
        this.videoEl.removeEventListener(this.listener);
    }

    stop() {
        this.videoEl.pause();
        this.videoEl.currentTime = 0;
    }

    componentDidUpdate(oldProps) {
        if (oldProps.video !== this.props.video) {
            this.replay();
        } else if (!oldProps.paused && this.props.paused) {
            this.pause();
        } else if (oldProps.paused && !this.props.paused) {
            this.play();
        } else if (!this.props.paused && !this.props.playing) {
            this.stop();
        }
    }

    render() {
        return (
            <div className="video-container">
                <video ref={this.videoEl} src={this.props.video}>
                    <p>HTML5 video is not supported</p>
                </video>
            </div>
        );
    }
}