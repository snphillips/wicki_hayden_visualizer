import { useEffect, useState } from 'react';

import HexGrid from './HexGrid';
import { MIDIMessageType } from '../types';

const App = () => {
  const [midiSupported, setMidiSupported] = useState<boolean>(false);
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [prevActiveNotes, setPrevActiveNotes] = useState<number[]>([]);

  // Runs on first render
  useEffect(() => {
    function onMIDISuccess(midiAccess: WebMidi.MIDIAccess) {
      console.log('midiAccess:', midiAccess);
      const inputs = midiAccess.inputs.values();
      for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = handleMIDIMessage;
      }
    }

    function onMIDIFailure(error: Error) {
      console.error('Could not access your MIDI devices.', error);
    }

    function handleMIDIMessage(this: any, event: Event) {
      if ('data' in event) {
        const messageEvent = event as MessageEvent;
        const [status, note, velocity] = Array.from(messageEvent.data) as [number, number, number];

        if (note) {
          onMIDIMessage([status as 128 | 144, note, velocity]);
          console.log(`status: ${status}, note: ${note},  velocity: ${velocity}`);
        }
      }
    }

    if (navigator.requestMIDIAccess) {
      setMidiSupported(true);
      navigator.requestMIDIAccess({ sysex: true }).then(onMIDISuccess, onMIDIFailure);
    } else {
      console.log('WebMIDI is not supported in this browser.');
    }
  }, []);

  const onMIDIMessage = (MIDImessage: MIDIMessageType) => {
    const noteOn = 144;
    const noteOff = 128;
    console.log('MIDImessage:', MIDImessage);
    const [status, note, velocity] = MIDImessage;
    // console.log(`status:${status}, note: ${note },  velocity: ${velocity}`)
    // Handle note on
    if (status === noteOn && velocity > 0) {
      setActiveNotes((prevNotes: number[]) => [...new Set([...prevNotes, note])]);
      // Handle note off
    } else if (status === noteOff || (status === noteOn && velocity === 0)) {
      setActiveNotes((prevNotes: number[]) => prevNotes.filter((n: number) => n !== note));
    }
  };

  return (
    <div className="app">
      {!midiSupported ? (
        <p className="not-supported-message">MIDI is not supported on this device.</p>
      ) : (
        <HexGrid
          activeNotes={activeNotes}
          prevActiveNotes={prevActiveNotes}
          setPrevActiveNotes={setPrevActiveNotes}
        />
      )}
    </div>
  );
};

export default App;
