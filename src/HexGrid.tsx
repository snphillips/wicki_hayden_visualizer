import React, { useEffect, useRef } from 'react';
import { defineHex, Grid, rectangle, hexToPoint, Hex } from 'honeycomb-grid';
import { SVG } from '@svgdotjs/svg.js';
import midiToNote from './midiToNote';
import { hexToMidiNote, MidiNoteToHex } from './midiToHex';

// See #hex-grid in index.css for additional styling
const HEX_FILL_COLOR = '#f2f2f2'; // light gray
const HEX_STROKE_COLOR = '#b3b3b3'; // gray
const HEX_ACTIVE_FILL_COLOR = '#b3e87d'; // lime green
const TEXT_FILL_COLOR = '#000'; // black
const HEX_STROKE_WIDTH = 3;
const TEXT_FONT_SIZE = 14;
const TEXT_VERTICAL_OFFSET = 8;
const CELL_SIZE = 50;
const NUM_TILES_X_AXIS = 9;
const NUM_TILES_Y_AXIS = 9;
const TOP_MARGIN = -50;
const LEFT_MARGIN = -45;

type Props = {
  activeNotes: number[];
  prevActiveNotes: number[];
  setPrevActiveNotes: (prevActiveNotes: number[] | ((prev: number[]) => number[])) => void;
};

const HexGrid = ({ activeNotes, prevActiveNotes, setPrevActiveNotes }: Props) => {
  console.log('activeNotes:', activeNotes);
  const svgRef: React.RefObject<HTMLDivElement> = useRef(null);
  const gridRef = useRef<Grid<Hex> | undefined>(); // Use useRef to persist grid across re-renders
  const drawRef = useRef<any>(); // Use useRef to persist draw across re-renders

  // Draw the SVG
  function renderSVG(hex: Hex) {
    const midiNote = hexToMidiNote(hex);
    const noteName = midiToNote[Number(midiNote)];
    // Create a polygon from a hex's corner points and add it to the existing SVG canvas
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _hexPolygon = drawRef.current
      .polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
      .fill(HEX_FILL_COLOR)
      .stroke({ width: HEX_STROKE_WIDTH, color: HEX_STROKE_COLOR })
      .data('row', hex.row) // Add data-row attribute
      .data('col', hex.col); // Add data-col attribute

    // Add text to display the index
    const center = hexToPoint(hex);
    drawRef.current
      .text(`${noteName}`)
      .move(center.x, center.y - TEXT_VERTICAL_OFFSET)
      .font({ anchor: 'middle', size: TEXT_FONT_SIZE, fill: TEXT_FILL_COLOR })
      .stroke({ color: HEX_STROKE_COLOR });
  }

  useEffect(() => {
    if (svgRef.current) {
      // Create the SVG canvas once
      drawRef.current = SVG().addTo(svgRef.current).size('100%', '100%');

      // Define the hex with the origin set to 'topLeft' for rendering purposes
      const Hex = defineHex({ dimensions: CELL_SIZE, origin: { x: LEFT_MARGIN, y: TOP_MARGIN } });
      gridRef.current = new Grid(Hex, rectangle({ width: NUM_TILES_X_AXIS, height: NUM_TILES_Y_AXIS }));

      gridRef.current.forEach(renderSVG);
    }
  }, []);

  // Runs on every render
  useEffect(() => {
    // Update hexagons corresponding to currently active notes
    activeNotes.forEach((note: number) => {
      const hexes = MidiNoteToHex(note);
      // If note is out of bounds(too high or too low), do nothing
      if (!hexes) {
        return;
      } else {
        hexes.forEach((hex: string) => {
          const hexData = hex.split(',');
          const hexPolygon = drawRef.current.find(
            `polygon[data-row='${hexData[1]}'][data-col='${hexData[0]}']`,
          );
          hexPolygon.fill(HEX_ACTIVE_FILL_COLOR);
        });
      }
    });

    // Reset hexagons corresponding to previously active notes that are no longer active
    // If it was on, and now it's not, turn it off
    prevActiveNotes.forEach((note: number) => {
      if (!activeNotes.includes(note)) {
        const hexes = MidiNoteToHex(note);
        // If note is out of bounds(too high or too low), do nothing
        if (!hexes) {
          return;
        } else {
          hexes.forEach((hex: string) => {
            const hexData = hex.split(',');
            const hexPolygon = drawRef.current.find(
              `polygon[data-row='${hexData[1]}'][data-col='${hexData[0]}']`,
            );
            hexPolygon.fill(HEX_FILL_COLOR);
          });
        }
      }
    });

    // Update the previous active notes state
    setPrevActiveNotes(activeNotes);
  }, [activeNotes, setPrevActiveNotes, prevActiveNotes]);

  return <div id="hex-grid" ref={svgRef} />;
};

export default React.memo(HexGrid);
