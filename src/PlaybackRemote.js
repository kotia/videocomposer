import React, { Component } from 'react';
import './PlaybackRemote.css';

export default class PlaybackRemote extends Component {

    render() {
        return (
            <div className="remotes__videos-playback">
                {this.props.videos.map((url, i) =>
                    <button key={url} onClick={this.props.changeVideo(i)}>{i}</button>
                )}
            </div>
        );
    }
}