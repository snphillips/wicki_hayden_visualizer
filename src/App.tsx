// latest App.js
import React, { useState } from "react"
import MidiReceiver from "./midiReceiver.js"

import HexGrid from "./HexGrid"
import { MIDIMessageType }  from './types'

const App = () => {
  const [activeNotes, setActiveNotes] = useState<number[]>([])
  const [prevActiveNotes, setPrevActiveNotes] = useState<number[]>([])

  const onMIDIMessage = (MIDImessage: MIDIMessageType) => {
    const noteOn = 144;
    const noteOff = 128;
    console.log('MIDImessage:', MIDImessage)
    let [status, note, velocity] = MIDImessage
    // console.log(`status:${status}, note: ${note },  velocity: ${velocity}`)
    // Handle note on
    if (status === noteOn && velocity > 0) {
      setActiveNotes((prevNotes: number[]) => [...new Set([...prevNotes, note])])
      // Handle note off
    } else if (status === noteOff || (status === noteOn && velocity === 0)) {
      setActiveNotes((prevNotes: number[]) => prevNotes.filter((n: number) => n !== note))
    }
  }

  return (
    <div>
      <MidiReceiver onMIDIMessage={onMIDIMessage} />
      <HexGrid
        activeNotes={activeNotes}
        prevActiveNotes={prevActiveNotes}
        setPrevActiveNotes={setPrevActiveNotes}
      />
    </div>
  )
}

export default App
