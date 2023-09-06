import React, { Component } from 'react';

class MidiInstrument extends Component {
    state = {
        midiSupported: false,
        midiMessages: []
    };

    componentDidMount() {
        if (navigator.requestMIDIAccess) {
            this.setState({ midiSupported: true });
            navigator.requestMIDIAccess({ sysex: true })
                .then(this.onMIDISuccess, this.onMIDIFailure);
        } else {
            console.log('WebMIDI is not supported in this browser.');
        }
    }

    onMIDISuccess = (midiAccess) => {
        const inputs = midiAccess.inputs.values();
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = this.onMIDIMessage;
        }
    };

    onMIDIFailure = (error) => {
        console.error('Could not access your MIDI devices.', error);
    };

    onMIDIMessage = (message) => {
        let [status, note, velocity] = message.data;
        this.setState(prevState => ({
            midiMessages: [...prevState.midiMessages, { status, note, velocity }]
        }));
        console.log('YES')
        // Handle the MIDI message here or pass it to another method
    };

    render() {
        return (
            <div>
                <h2>MIDI Instrument</h2>
                {this.state.midiSupported ? (
                    <div>
                        <p>MIDI is supported in this browser.</p>
                        <ul>
                            {this.state.midiMessages.map((msg, index) => (
                                <li key={index}>
                                    Status: {msg.status}, Note: {msg.note}, Velocity: {msg.velocity}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>MIDI is not supported in this browser.</p>
                )}
            </div>
        );
    }
}

export default MidiInstrument;
