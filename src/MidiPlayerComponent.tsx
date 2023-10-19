import { useState } from 'react';
import MidiPlayer from 'react-midi-player';

// not using

const MidiPlayerComponent = () => {
  const [source] = useState('../The-Entertainer.mid');

  // functions are just for demo purposes
  function handleOnPlay() {
    console.log('🎶 MIDI player play');
  }

  function handleOnPause() {
    console.log('⏸️ MIDI player PAUSE');
  }

  function handleOnStop() {
    console.log('🛑 MIDI player STOP');
  }

  return (
    <div id="midi-player">
      <MidiPlayer
        src={source}
        engine="Web Audio" // don't need this
        onPlay={handleOnPlay}
        onPause={handleOnPause}
        onStop={handleOnStop}
      />
    </div>
  );
};
export default MidiPlayerComponent;
