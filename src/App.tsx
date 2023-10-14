// latest App.js
import React, { useState } from "react"
import MidiInstrument from "./midiInstrument.jsx"

import HexGrid from "./HexGrid"
import { MIDIMessageType }  from './types'

const App = () => {
  const [activeNotes, setActiveNotes] = useState<number[]>([])
  const [prevActiveNotes, setPrevActiveNotes] = useState<number[]>([])

  const onMIDIMessage = (MIDImessage: MIDIMessageType) => {
    console.log('MIDImessage:', MIDImessage)
    let [status, note, velocity] = MIDImessage
    // console.log(`status:${status}, note: ${note },  velocity: ${velocity}`)
    if (status === 144 && velocity > 0) {
      // note on
      setActiveNotes((prevNotes: number[]) => [...new Set([...prevNotes, note])])
    } else if (status === 128 || (status === 144 && velocity === 0)) {
      // Handle note off
      setActiveNotes((prevNotes: number[]) => prevNotes.filter((n: number) => n !== note))
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
