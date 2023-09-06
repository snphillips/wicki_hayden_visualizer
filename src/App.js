

import React, { useState } from 'react';
import MidiInstrument from './midiInstrument';

import HexGrid from './HexGrid';

const App = () => {
    const [activeNotes, setActiveNotes] = useState([]);

    const handleMIDIMessage = (message) => {
        // ... your existing MIDI message handling logic
        // For example, if a note-on message is received:
        setActiveNotes(prevNotes => [...prevNotes, message.note]);
        // For a note-off message:
        // setActiveNotes(prevNotes => prevNotes.filter(n => n !== message.note));
    };

    return (
        <div>
            <MidiInstrument onMIDIMessage={handleMIDIMessage} />
            <HexGrid activeNotes={activeNotes} />
        </div>
    );
};

export default App;
