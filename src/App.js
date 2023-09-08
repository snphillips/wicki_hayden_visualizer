

import React, { useState } from 'react';
import MidiInstrument from './midiInstrument';

import HexGrid from './HexGrid';

const App = () => {
  const [activeNotes, setActiveNotes] = useState([]);

  const onMIDIMessage = (message) => {
        // ... your existing MIDI message handling logic
        // For example, if a note-on message is received:
        // For a note-off message:
    let [status, note, velocity] = message;
    // console.log(`note: ${note },  velocity: ${velocity}`)

if ((status >= 0x90 && velocity === 0) || (status >= 0x80 && status < 0x90)) {

        setActiveNotes(prevNotes => prevNotes.filter(n => n !== note));  
    }
    if (velocity>0) {
    // setActiveNotes(prevNotes => prevNotes.filter(n => n !== note));
        setActiveNotes(prevNotes => [... new Set( [...prevNotes, note] )]);  
    // setActiveNotes(prevNotes => [...prevNotes, note]);  
      
    }

  };

  return (
    <div>
    <MidiInstrument onMIDIMessage={onMIDIMessage} />
    <HexGrid activeNotes={activeNotes} />
    </div>
    );
};

export default App;
