//rewrite midiToHex function to accept a single midi note, and return it's hex 
const midiToHex = (midiNote) => {
    const startMidiNote = 62;  // Middle D
    const startHex = { col: 4, row: 4 };
    const directions = {
        NE: 7,  // perfect 5th
        E: 2,  // whole tone
        NW: 5   // perfect 4th
    };

    let difference = midiNote - startMidiNote;
    let currentHex = { ...startHex };

    for (const [direction, semitones] of Object.entries(directions)) {
        while (Math.abs(difference) >= semitones) {
            if (difference < 0) {
                // If the difference is negative, move in the opposite direction
                currentHex = moveOppositeDirection(currentHex, direction);
                difference += semitones;
            } else {
                currentHex = moveInDirection(currentHex, direction);
                difference -= semitones;
            }
        }
    }

    return currentHex;
};

// Assuming moveInDirection and moveOppositeDirection functions are defined elsewhere in your code.

const moveInDirection = (hex, direction) => {
    switch (direction) {
        case 'NE': return { col: hex.col + 1, row: hex.row - 1 };
        case 'E': return { col: hex.col + 1, row: hex.row };
        case 'NW': return { col: hex.col, row: hex.row - 1 };
        default: return hex;
    }
};

const moveOppositeDirection = (hex, direction) => {
    switch (direction) {
        case 'NE': return { col: hex.col - 1, row: hex.row + 1 };
        case 'E': return { col: hex.col - 1, row: hex.row };
        case 'NW': return { col: hex.col, row: hex.row + 1 };
        default: return hex;
    }
};

// Example usage:
// const midiNotes = [60, 64, 67];  // C4, E4, G4
// console.log(midiToHex(midiNotes));


const  hexToMidiNote = (hex) => {
    // Assuming middle D (MIDI note number 62) is at { col: 4, row: 4 }
    const baseMidiNote = 62; 

    // Calculate the offsets from the center hex
    const colOffset = hex.col - 4;
    const rowOffset = hex.row - 4;

    // Calculate the MIDI note number based on the offsets and the given constraints
    const midiNote = baseMidiNote 
                    + colOffset * 2  // Moving in E direction: 2 semitones
                    + rowOffset * 7; // Moving in NE direction: 7 semitones

    return midiNote;
}


export { midiToHex, hexToMidiNote };
