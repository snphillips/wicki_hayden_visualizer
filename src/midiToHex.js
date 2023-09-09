import { defineHex, Grid, rectangle, hexToPoint,fromCoordinates } from 'honeycomb-grid';


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
    // Assuming middle D (MIDI note number 50) is at { col: 4, row: 4 }

    // Calculate the offsets from the center hex
    const colOffset = hex.col - 4;
    const rowOffset = hex.row - 4;


    return litteralMap[`${hex.col},${hex.row}`]+12;
}


const litteralMap = {
  '0,0': 66,
  '0,1': 61,
  '0,2': 54,
  '0,3': 49,
  '0,4': 42,
  '0,5': 37,
  '0,6': 30,
  '0,7': 25,
  '0,8': 18,
  '0,9': 13,
  '1,0': 68,
  '1,1': 63,
  '1,2': 56,
  '1,3': 51,
  '1,4': 44,
  '1,5': 39,
  '1,6': 32,
  '1,7': 27,
  '1,8': 20,
  '1,9': 15,
  '2,0': 70,
  '2,1': 65,
  '2,2': 58,
  '2,3': 53,
  '2,4': 46,
  '2,5': 41,
  '2,6': 34,
  '2,7': 29,
  '2,8': 22,
  '2,9': 17,
  '3,0': 72,
  '3,1': 67,
  '3,2': 60,
  '3,3': 55,
  '3,4': 48,
  '3,5': 43,
  '3,6': 36,
  '3,7': 31,
  '3,8': 24,
  '3,9': 19,
  '4,0': 74,
  '4,1': 69,
  '4,2': 62,
  '4,3': 57,
  '4,4': 50,
  '4,5': 45,
  '4,6': 38,
  '4,7': 33,
  '4,8': 26,
  '4,9': 21,
  '5,0': 76,
  '5,1': 71,
  '5,2': 64,
  '5,3': 59,
  '5,4': 52,
  '5,5': 47,
  '5,6': 40,
  '5,7': 35,
  '5,8': 28,
  '5,9': 23,
  '6,0': 78,
  '6,1': 73,
  '6,2': 66,
  '6,3': 61,
  '6,4': 54,
  '6,5': 49,
  '6,6': 42,
  '6,7': 37,
  '6,8': 30,
  '6,9': 25,
  '7,0': 80,
  '7,1': 75,
  '7,2': 68,
  '7,3': 63,
  '7,4': 56,
  '7,5': 51,
  '7,6': 44,
  '7,7': 39,
  '7,8': 32,
  '7,9': 27,
  '8,0': 82,
  '8,1': 77,
  '8,2': 70,
  '8,3': 65,
  '8,4': 58,
  '8,5': 53,
  '8,6': 46,
  '8,7': 41,
  '8,8': 34,
  '8,9': 29,
  '9,0': 84,
  '9,1': 79,
  '9,2': 72,
  '9,3': 67,
  '9,4': 60,
  '9,5': 55,
  '9,6': 48,
  '9,7': 43,
  '9,8': 36,
  '9,9': 31
}


const generateHexToMidiMapping = (width, height) => {
    const mapping = {};
    for (let col = 0; col < width; col++) {
        for (let row = 0; row < height; row++) {
            if (row % 2 === 0) { // even row
                if (col === 0 && row === 0) {
                    mapping[`${col},${row}`] = 66;
                } else if (col === 0) {
                    mapping[`${col},${row}`] = mapping[`0,${row - 2}`] - 12;
                } else {
                    mapping[`${col},${row}`] = mapping[`${col - 1},${row}`] + 2;
                }
            } else { // odd row
                if (col === 0 && row === 1) {
                    mapping[`${col},${row}`] = 61;
                } else if (col === 0) {
                    mapping[`${col},${row}`] = mapping[`0,${row - 2}`] - 12;
                } else {
                    mapping[`${col},${row}`] = mapping[`${col - 1},${row}`] + 2;
                }
            }
        }
    }
    return mapping;
};

// const hexToMidiMapping = generateHexToMidiMapping(10, 10); // Adjust width and height as needed
// console.log(hexToMidiMapping);



export { midiToHex, hexToMidiNote };
