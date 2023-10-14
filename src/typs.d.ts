
// TypeScript's built-in type definitions for the navigator object
// do not include the requestMIDIAccess property, which is a part of
// the Web MIDI API. The Web MIDI API isn't universally supported in
// all browsers, so it's not in the default TypeScript type definitions.
// We extend the Navigator type to include this method.

interface Navigator {
  requestMIDIAccess(options?: { sysex: boolean }): Promise<any>;
}
