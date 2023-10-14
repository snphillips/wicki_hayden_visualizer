import React, { useState, useEffect } from 'react';
import { MIDIMessageType } from './types';

type Props = {
  onMIDIMessage: (MIDImessage: MIDIMessageType) => void;
};

const MidiReceiver = ({ onMIDIMessage }) => {
  const [midiSupported, setMidiSupported] = useState<boolean>(false);
  // const [midiMessages, setMidiMessages] = useState([])

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      setMidiSupported(true);
      navigator.requestMIDIAccess({ sysex: true }).then(onMIDISuccess, onMIDIFailure);
    } else {
      console.log('WebMIDI is not supported in this browser.');
    }

    function onMIDISuccess(midiAccess: MIDIAccess) {
      console.log('midiAccess:', midiAccess);
      const inputs = midiAccess.inputs.values();
      for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = handleMIDIMessage;
      }
    }

    function onMIDIFailure(error: Error) {
      console.error('Could not access your MIDI devices.', error);
    }

    function handleMIDIMessage(this: MIDIInput, event: Event) {
      if ('data' in event) {
        const messageEvent = event as MIDIMessageEvent;
        let [status, note, velocity] = messageEvent.data;
        if (note) {
          onMIDIMessage(messageEvent.data);
          // console.log(`status: ${status}, note: ${note },  velocity: ${velocity}`)
        }
      }
    }
  }, [onMIDIMessage]);

  return <div className="get-rid-of"></div>;
};

export default MidiReceiver;
