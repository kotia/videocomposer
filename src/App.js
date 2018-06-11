import React, { Component } from 'react';
import './App.css';

import PlayRemote from './PlayRemote';
import PlaybackRemote from './PlaybackRemote';
import RecordRemote from './RecordRemote';
import OutputRemote from './OutputRemote';

import Video from './Video';

class App extends Component {
    constructor(props) {
        super(props);
        this.videos = [
            'https://d15t3vksqnhdeh.cloudfront.net/videos/1.mp4',
            'https://d15t3vksqnhdeh.cloudfront.net/videos/2.mp4',
            'https://d15t3vksqnhdeh.cloudfront.net/videos/3.mp4'
        ];
        this.videoEl = React.createRef();
        this.recordingInterval = undefined;
        this.playingInterval = undefined;

        this.state = {
            video: 0,
            changedVideo: 0,
            recording: false,
            recordTime: 0,

            playing: false,
            paused: false,

            playTime: 0,
            currentPlayingSlide: 0,
            recordingStart: 0,
            timeline: []
        };

        this.changeVideo = this.changeVideo.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);

        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.stop = this.stop.bind(this);
        this.hasPlayFinished = this.hasPlayFinished.bind(this);
    }

    startRecordingTimeTicker() {
        this.recordingInterval = setInterval(() => {
            this.setState({
                recordTime: Math.round(this.state.recordTime * 10 + 1)/10
            });
        }, 100);
    }

    changeVideo(number) {
        return () => {
            const timestamp = Date.now();
            this.setState({
                video: number,
                changedVideo: this.state.changedVideo + 1,
                timeline: this.state.recording ?
                    [...this.state.timeline, [
                        number,
                        Math.round((timestamp - this.state.recordingStart)/100)/10
                    ]] : this.state.timeline
            });
        }
    }

    startRecording() {
        this.setState({
            recording: true,
            timeline: [],
            recordingStart: Date.now()
        });
        this.startRecordingTimeTicker();
    }

    stopRecording() {
        this.setState({
            recording: false,
        });
        clearInterval(this.recordingInterval);
    }

    switchToNextVideo(playTime) {
        const videoData = this.state.timeline[this.state.currentPlayingSlide];
        if (
            (playTime ? playTime : this.state.playTime) === videoData[1]
        ) {
            this.changeVideo(videoData[0])();
            
            if (this.state.timeline.length - 1 > this.state.currentPlayingSlide) {
                this.setState({currentPlayingSlide: this.state.currentPlayingSlide + 1});
            }
        }
    }

    play() {
        this.setState({
            playing: true,
            paused: false
        });

        this.switchToNextVideo();

        this.playingInterval = setInterval(() => {
            const playTime = Math.round(this.state.playTime * 10 + 1)/10;
            this.setState({
                playTime: playTime
            });
            this.switchToNextVideo(playTime);
        }, 100);
    }

    pause() {
        clearInterval(this.playingInterval);
        this.setState({
            playing: false,
            paused: true
        });
    }

    stop() {
        clearInterval(this.playingInterval);
        this.setState({
            playing: false,
            paused: false,
            playTime: 0,
            currentPlayingSlide: 0
        });
    }

    hasPlayFinished() {
        if (this.state.playing && this.state.timeline.length - 1 === this.state.currentPlayingSlide) {
            this.stop();
        }
    }

    render() {
        return (
            <div className="App">
                <Video
                    video={this.videos[this.state.video]}
                    paused={this.state.paused}
                    playing={this.state.playing}
                    changedVideo={this.state.changedVideo}
                    playFinished={this.hasPlayFinished}
                />
                <div className="remotes">
                    <PlaybackRemote
                        changeVideo={this.changeVideo}
                        videos={this.videos}
                    />
                    <RecordRemote
                        recording={this.state.recording}
                        startRecording={this.startRecording}
                        stopRecording={this.stopRecording}
                        recordTime={this.state.recordTime}
                    />
                    {!this.state.recording && this.state.timeline.length ?
                        <PlayRemote
                            playing={this.state.playing}
                            paused={this.state.paused}
                            play={this.play}
                            pause={this.pause}
                            stop={this.stop}
                        /> : null
                    }
                    <OutputRemote
                        timeline={this.state.timeline}
                    />
                </div>
            </div>
        );
    }
}

export default App;
