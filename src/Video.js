import React, { Component } from 'react';
import './Video.css';

export default class Video extends Component {
    constructor(props) {
        super(props);
        this.videoEl = React.createRef();
    }

    play() {
        this.videoEl.current.play();
        this.videoEl.current.addEventListener('ended', this.props.playFinished);
    }

    replay() {
        this.videoEl.current.pause();
        this.videoEl.current.currentTime = 0;
        this.play();
    }

    pause() {
        this.videoEl.current.pause();
        this.videoEl.current.removeEventListener('ended', this.props.playFinished);
    }

    stop() {
        this.videoEl.current.pause();
        this.videoEl.current.currentTime = 0;
    }

    componentDidUpdate(oldProps) {
        if (oldProps.video !== this.props.video || oldProps.changedVideo !== this.props.changedVideo) {
            this.replay();
        } else if (!oldProps.paused && this.props.paused) {
            this.pause();
        } else if (oldProps.paused && !this.props.paused) {
            this.play();
        } else if (!this.props.paused && !this.props.playing && (oldProps.paused || oldProps.playing)) {
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