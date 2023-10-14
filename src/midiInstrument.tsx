import React, { useState, useEffect } from 'react';

const MidiInstrument = ({ onMIDIMessage }: any) => {
    const [midiSupported, setMidiSupported] = useState<boolean>(false)
    const [midiMessages, setMidiMessages] = useState([])

    useEffect(() => {
        if (navigator.requestMIDIAccess) {
            setMidiSupported(true)
            navigator
                .requestMIDIAccess({ sysex: true })
                .then(onMIDISuccess, onMIDIFailure)
        } else {
            console.log('WebMIDI is not supported in this browser.')
        }

        function onMIDISuccess(midiAccess: any) {
            const inputs = midiAccess.inputs.values()
            for (
                let input = inputs.next();
                input && !input.done;
                input = inputs.next()
            ) {
                input.value.onmidimessage = handleMIDIMessage
            }
        }

        function onMIDIFailure(error: any) {
            console.error('Could not access your MIDI devices.', error)
        }

        function handleMIDIMessage(message: any) {
            let [status, note, velocity] = message.data
            if (note) {
                onMIDIMessage(message.data)
                // console.log(`status: ${status}, note: ${note },  velocity: ${velocity}`)
            }
        }
    }, [onMIDIMessage])

    return (
        <div>
        </div>
    )
}

export default MidiInstrument;
