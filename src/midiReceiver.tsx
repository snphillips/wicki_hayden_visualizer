import React, { useState, useEffect } from 'react';
import { MIDIMessageType } from '../types';

type Props = {
  onMIDIMessage: (argument: MIDIMessageType) => void;
};

const MidiReceiver = ({ onMIDIMessage }: Props) => {
  const [midiSupported, setMidiSupported] = useState<boolean>(false);
  // const [midiMessages, setMidiMessages] = useState([])

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      setMidiSupported(true);
      navigator.requestMIDIAccess({ sysex: true }).then(onMIDISuccess, onMIDIFailure);
    } else {
      console.log('WebMIDI is not supported in this browser.');
    }

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
  }, [onMIDIMessage]);

  return <div>{midiSupported ? '' : <p>MIDI is not supported.</p>}</div>;
};

export default MidiReceiver;
