import { useEffect, useState } from 'react';

import HexGrid from './HexGrid';
import Instructions from './Instructions';
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
        const [status, note, velocity] = Array.from(messageEvent.data) as [128 | 144, number, number];

        if (note) {
          onMIDIMessage([status, note, velocity]);
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
    <div id="app">
      {!midiSupported ? (
        <p className="not-supported-message">MIDI is not supported on this device.</p>
      ) : (
        <HexGrid
          activeNotes={activeNotes}
          prevActiveNotes={prevActiveNotes}
          setPrevActiveNotes={setPrevActiveNotes}
        />
      )}
      <Instructions />
      {/* <div id="app-instructions">
        <h1>Wicki Hayden Visualizer</h1>
        <p>This app visualizes MIDI signals onto a Wicki Hayden note layout.</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac sem nisi. Proin in tincidunt
          nisl. Morbi sed augue nisl. Mauris vehicula lectus velit, eget volutpat dolor congue auctor. Mauris
          at felis ac libero efficitur volutpat.
        </p>
        <button>Learn more about Wicki-Hayden Note Layout</button>
        <button>Visit project github page</button>
      </div> */}
    </div>
  );
};

export default App;
