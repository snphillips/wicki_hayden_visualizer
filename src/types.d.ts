
// TypeScript's built-in type definitions for the navigator object
// do not include the requestMIDIAccess property, which is a part of
// the Web MIDI API. The Web MIDI API isn't universally supported in
// all browsers, so it's not in the default TypeScript type definitions.

// Here we extend the Navigator type to include this method.

interface Navigator {
  requestMIDIAccess(options?: { sysex: boolean }): Promise<any>;
}

export type MIDIMessageType = [
  status: 128 | 144, // Note On === 144, Note Off === 128
  note: number, // A number between 0 and 127.
  velocity: number // A number between 0 and 127. The higher the number, the stronger the key press.
]


