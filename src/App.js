import React, { Component } from 'react';
import './App.css';

import PlayRemote from './PlayRemote';

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
            changedPlaying: 0,
            recording: false,
            recordTime: 0,

            playing: false,
            paused: false,
            stopped: false,

            playTime: 0,
            currentPlayingSlide: 0,
            recordingStart: 0,
            timeline: []
        };

        this.changePlaying = this.changePlaying.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);

        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.stop = this.stop.bind(this);
    }

    startRecordingTimeTicker() {
        this.recordingInterval = setInterval(() => {
            this.setState({
                recordTime: Math.round(this.state.recordTime * 10 + 1)/10
            });
        }, 100);
    }

    changePlaying(number) {
        return () => {
            this.setState({
                video: number,
                changedPlaying: this.state.changedPlaying + 1
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

    switchToNextVideo(playTime) {
        if ((playTime ? playTime : this.state.playTime) === this.state.timeline[this.state.currentPlayingSlide][1] ) {
            this.changePlaying(this.state.timeline[this.state.currentPlayingSlide][0])();
            if (this.state.timeline.length - 1 > this.state.currentPlayingSlide) {
                this.setState({currentPlayingSlide: this.state.currentPlayingSlide + 1});
            }
        }
    }

    pause() {
        clearInterval(this.playingInterval);
        this.pauseVideo();
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
        this.stopVideo();
    }

    playVideo() {
        const video = this.videoEl.current;
        video.play();
    }

    replayVideo() {
        const video = this.videoEl.current;
        video.pause();
        video.currentTime = 0;
        video.play();
        video.addEventListener('ended', () => {
            if (this.state.playing && this.state.timeline.length - 1 === this.state.currentPlayingSlide) {
                this.stopVideo();
                this.stop();
            }
        });
    }

    pauseVideo() {
        const video = this.videoEl.current;
        video.pause();
    }

    stopVideo() {
        const video = this.videoEl.current;
        video.currentTime = 0;
        video.pause();
    }

    addTimestamp() {
        if (this.state.recording) {
            const timestamp = Date.now();
            this.setState({
                timeline: [...this.state.timeline, [
                    this.state.video,
                    Math.round((timestamp - this.state.recordingStart)/100)/10
                ]]
            });
        }
    }

    componentDidUpdate(oldProps, oldState) {
        if (oldState.changedPlaying !== this.state.changedPlaying) {
            this.replayVideo();
            this.addTimestamp();
        }

        if (oldState.paused === true && this.state.paused === false) {
            this.playVideo();
        }
    }

    render() {
        return (
            <div className="App">
                <div className="video-container">
                    <video ref={this.videoEl} src={this.videos[this.state.video]}>
                        <p>HTML5 video is not supported</p>
                    </video>
                </div>
                <div className="remotes">
                    <div className="remotes__videos-playback">
                        <button onClick={this.changePlaying(0)}>1</button>
                        <button onClick={this.changePlaying(1)}>2</button>
                        <button onClick={this.changePlaying(2)}>3</button>
                    </div>
                    <div className="remotes__records">
                        {
                            this.state.recording ?
                                <button onClick={this.stopRecording}>Stop recording</button> :
                                <button onClick={this.startRecording}>Start recording</button>
                        }

                        {
                            this.state.recording ?
                                <span className="time-ticker">{this.state.recordTime}</span> :
                                null
                        }
                    </div>
                    {!this.state.recording && this.state.timeline.length ?
                        <PlayRemote
                            playing={this.state.playing}
                            paused={this.state.paused}
                            play={this.play}
                            pause={this.pause}
                            stop={this.stop}
                        /> : null
                    }
                    <div className="remotes__record-output">
                        <h2>Output:</h2>
                        <div className="remotes__record-output__output">{
                            this.state.timeline.map((t, i) =>
                                <span className="record-milestone" key={i}>
                                    {t[0]}: {t[1]}
                                </span>
                            )
                        }</div>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
