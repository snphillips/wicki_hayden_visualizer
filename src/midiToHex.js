const midiToHex = (midiNotes) => {
    const startMidiNote = 62;  // Middle D
    const startHex = { col: 4, row: 4 };
    const directions = {
        NE: 7,  // perfect 5th
        E: 2,  // whole tone
        NW: 5   // perfect 4th
    };

    const mapping = {};

    for (const note of midiNotes) {
        let difference = note - startMidiNote;
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

        mapping[note] = currentHex;
    }

    return mapping;
};

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
const midiNotes = [60, 64, 67];  // C4, E4, G4
console.log(midiToHex(midiNotes));


export default midiToHex