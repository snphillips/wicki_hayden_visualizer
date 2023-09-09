import React, { useState } from "react"
import MidiInstrument from "./midiInstrument"

import HexGrid from "./HexGrid"

const App = () => {
  const [activeNotes, setActiveNotes] = useState([])

  const onMIDIMessage = (message) => {
    let [status, note, velocity] = message
    // console.log(`status:${status}, note: ${note },  velocity: ${velocity}`)
    if (status === 144 && velocity > 0) {
      // note on
      setActiveNotes((prevNotes) => [...new Set([...prevNotes, note])])
    } else if (status === 128 || (status === 144 && velocity === 0)) {
      // Handle note off
      setActiveNotes((prevNotes) => prevNotes.filter((n) => n !== note))
    }
  }

  return (
    <div>
      <MidiInstrument onMIDIMessage={onMIDIMessage} />
      <HexGrid activeNotes={activeNotes} />
    </div>
  )
}

export default App
