import React, { useState, useEffect } from 'react';

const MidiInstrument = ({ onMIDIMessage }) => {
    const [midiSupported, setMidiSupported] = useState(false);
    const [midiMessages, setMidiMessages] = useState([]);

    useEffect(() => {
        if (navigator.requestMIDIAccess) {
            setMidiSupported(true);
            navigator.requestMIDIAccess({ sysex: true })
                .then(onMIDISuccess, onMIDIFailure);
        } else {
            console.log('WebMIDI is not supported in this browser.');
        }

        function onMIDISuccess(midiAccess) {
            const inputs = midiAccess.inputs.values();
            for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
                input.value.onmidimessage = handleMIDIMessage;
            }
        }

        function onMIDIFailure(error) {
            console.error('Could not access your MIDI devices.', error);
        }

        function handleMIDIMessage(message) {
            let [status, note, velocity] = message.data;
                if (note) {
                onMIDIMessage(message.data);
                // console.log(`status: ${status}, note: ${note },  velocity: ${velocity}`)

                }
        }
    }, [onMIDIMessage]);

    return (
        <div>
            <h2>MIDI Instrument</h2>
            {midiSupported ? (
                <div>
                    <p>MIDI is supported in this browser.</p>
                </div>
            ) : (
                <p>MIDI is not supported in this browser.</p>
            )}
        </div>
    );
};

export default MidiInstrument;
