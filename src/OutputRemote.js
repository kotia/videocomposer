import React, { Component } from 'react';
import './OutputRemote.css';

export default class OutputRemote extends Component {

    render() {
        return (
            <div className="remotes__record-output">
                <h2>Output:</h2>
                <div className="remotes__record-output__output">{
                    this.props.timeline.map((t, i) =>
                        <div className="record-milestone" key={i}>
                                    {t[0]}: {t[1]}
                                </div>
                    )
                }</div>
            </div>
        );
    }
}