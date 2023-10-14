// latest App.js
import React, { useState } from "react"
import MidiInstrument from "./midiInstrument.jsx"

import HexGrid from "./HexGrid"

const App = () => {
  const [activeNotes, setActiveNotes] = useState<any>([])
  const [prevActiveNotes, setPrevActiveNotes] = useState<any>([])

  const onMIDIMessage = (message: any) => {
    let [status, note, velocity] = message
    // console.log(`status:${status}, note: ${note },  velocity: ${velocity}`)
    if (status === 144 && velocity > 0) {
      // note on
      setActiveNotes((prevNotes: any) => [...new Set([...prevNotes, note])])
    } else if (status === 128 || (status === 144 && velocity === 0)) {
      // Handle note off
      setActiveNotes((prevNotes: any) => prevNotes.filter((n: any) => n !== note))
    }
  }

  return (
    <div>
      <MidiInstrument onMIDIMessage={onMIDIMessage} />
      <HexGrid
        activeNotes={activeNotes}
        prevActiveNotes={prevActiveNotes}
        setPrevActiveNotes={setPrevActiveNotes}
      />
    </div>
  )
}

export default App
