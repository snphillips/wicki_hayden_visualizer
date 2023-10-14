import {
    defineHex,
    Grid,
    rectangle,
    hexToPoint,
    fromCoordinates,
} from "honeycomb-grid"

const midiToHex = {
    13: ["0,9"],
    15: ["1,9"],
    17: ["2,9"],
    18: ["0,8"],
    19: ["3,9"],
    20: ["1,8"],
    21: ["4,9"],
    22: ["2,8"],
    23: ["5,9"],
    24: ["3,8"],
    25: ["0,7", "6,9"],
    26: ["4,8"],
    27: ["1,7", "7,9"],
    28: ["5,8"],
    29: ["2,7", "8,9"],
    30: ["0,6", "6,8"],
    31: ["3,7", "9,9"],
    32: ["1,6", "7,8"],
    33: ["4,7"],
    34: ["2,6", "8,8"],
    35: ["5,7"],
    36: ["3,6", "9,8"],
    37: ["0,5", "6,7"],
    38: ["4,6"],
    39: ["1,5", "7,7"],
    40: ["5,6"],
    41: ["2,5", "8,7"],
    42: ["0,4", "6,6"],
    43: ["3,5", "9,7"],
    44: ["1,4", "7,6"],
    45: ["4,5"],
    46: ["2,4", "8,6"],
    47: ["5,5"],
    48: ["3,4", "9,6"],
    49: ["0,3", "6,5"],
    50: ["4,4"],
    51: ["1,3", "7,5"],
    52: ["5,4"],
    53: ["2,3", "8,5"],
    54: ["0,2", "6,4"],
    55: ["3,3", "9,5"],
    56: ["1,2", "7,4"],
    57: ["4,3"],
    58: ["2,2", "8,4"],
    59: ["5,3"],
    60: ["3,2", "9,4"],
    61: ["0,1", "6,3"],
    62: ["4,2"],
    63: ["1,1", "7,3"],
    64: ["5,2"],
    65: ["2,1", "8,3"],
    66: ["0,0", "6,2"],
    67: ["3,1", "9,3"],
    68: ["1,0", "7,2"],
    69: ["4,1"],
    70: ["2,0", "8,2"],
    71: ["5,1"],
    72: ["3,0", "9,2"],
    73: ["6,1"],
    74: ["4,0"],
    75: ["7,1"],
    76: ["5,0"],
    77: ["8,1"],
    78: ["6,0"],
    79: ["9,1"],
    80: ["7,0"],
    82: ["8,0"],
    84: ["9,0"],
}

// swap the keys and values of this literal
// Map object, each midi note can have many hexkeys
const litteralMap = {
    "0,0": 66,
    "0,1": 61,
    "0,2": 54,
    "0,3": 49,
    "0,4": 42,
    "0,5": 37,
    "0,6": 30,
    "0,7": 25,
    "0,8": 18,
    "0,9": 13,
    "1,0": 68,
    "1,1": 63,
    "1,2": 56,
    "1,3": 51,
    "1,4": 44,
    "1,5": 39,
    "1,6": 32,
    "1,7": 27,
    "1,8": 20,
    "1,9": 15,
    "2,0": 70,
    "2,1": 65,
    "2,2": 58,
    "2,3": 53,
    "2,4": 46,
    "2,5": 41,
    "2,6": 34,
    "2,7": 29,
    "2,8": 22,
    "2,9": 17,
    "3,0": 72,
    "3,1": 67,
    "3,2": 60,
    "3,3": 55,
    "3,4": 48,
    "3,5": 43,
    "3,6": 36,
    "3,7": 31,
    "3,8": 24,
    "3,9": 19,
    "4,0": 74,
    "4,1": 69,
    "4,2": 62,
    "4,3": 57,
    "4,4": 50,
    "4,5": 45,
    "4,6": 38,
    "4,7": 33,
    "4,8": 26,
    "4,9": 21,
    "5,0": 76,
    "5,1": 71,
    "5,2": 64,
    "5,3": 59,
    "5,4": 52,
    "5,5": 47,
    "5,6": 40,
    "5,7": 35,
    "5,8": 28,
    "5,9": 23,
    "6,0": 78,
    "6,1": 73,
    "6,2": 66,
    "6,3": 61,
    "6,4": 54,
    "6,5": 49,
    "6,6": 42,
    "6,7": 37,
    "6,8": 30,
    "6,9": 25,
    "7,0": 80,
    "7,1": 75,
    "7,2": 68,
    "7,3": 63,
    "7,4": 56,
    "7,5": 51,
    "7,6": 44,
    "7,7": 39,
    "7,8": 32,
    "7,9": 27,
    "8,0": 82,
    "8,1": 77,
    "8,2": 70,
    "8,3": 65,
    "8,4": 58,
    "8,5": 53,
    "8,6": 46,
    "8,7": 41,
    "8,8": 34,
    "8,9": 29,
    "9,0": 84,
    "9,1": 79,
    "9,2": 72,
    "9,3": 67,
    "9,4": 60,
    "9,5": 55,
    "9,6": 48,
    "9,7": 43,
    "9,8": 36,
    "9,9": 31,
}

const generateHexToMidiMapping = (width, height) => {
    const mapping = {}
    for (let col = 0; col < width; col++) {
        for (let row = 0; row < height; row++) {
            if (row % 2 === 0) {
                // even row
                if (col === 0 && row === 0) {
                    mapping[`${col},${row}`] = 66
                } else if (col === 0) {
                    mapping[`${col},${row}`] = mapping[`0,${row - 2}`] - 12
                } else {
                    mapping[`${col},${row}`] = mapping[`${col - 1},${row}`] + 2
                }
            } else {
                // odd row
                if (col === 0 && row === 1) {
                    mapping[`${col},${row}`] = 61
                } else if (col === 0) {
                    mapping[`${col},${row}`] = mapping[`0,${row - 2}`] - 12
                } else {
                    mapping[`${col},${row}`] = mapping[`${col - 1},${row}`] + 2
                }
            }
        }
    }
    return mapping
}

function swapKeysAndValues(litteralMap: Record<string, string>): Record<string, string[]> {
    const swappedMap: Record<string, string[]> = {}

    for (const [hexKey, midiNote] of Object.entries(litteralMap)) {
        if (!swappedMap[midiNote]) {
            swappedMap[midiNote] = []
        }
        swappedMap[midiNote].push(hexKey)
    }

    return swappedMap
}


const MidiNoteToHex = (note) => {
    const hexes = midiToHex[note-12]

    return hexes
}

const hexToMidiNote = (hex) => {
    // Assuming middle D (MIDI note number 50) is at { col: 4, row: 4 }

    // Calculate the offsets from the center hex
    const colOffset = hex.col - 4
    const rowOffset = hex.row - 4

    return litteralMap[`${hex.col},${hex.row}`] + 12
}

export { hexToMidiNote, MidiNoteToHex }
