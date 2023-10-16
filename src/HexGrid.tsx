import React, { useEffect, useRef } from 'react';
import { defineHex, Grid, rectangle, hexToPoint, Hex } from 'honeycomb-grid';
import { SVG } from '@svgdotjs/svg.js';
import midiToNote from './midiToNote';
import { hexToMidiNote, MidiNoteToHex } from './midiToHex';

// Color literals extracted to constants
const HEX_FILL_COLOR = '#f2f2f2'; // light gray
const HEX_STROKE_COLOR = '#b3b3b3'; // gray
const HEX_ACTIVE_FILL_COLOR = '#b3e87d'; // lime green
const TEXT_FILL_COLOR = '#000'; // black

type Props = {
  activeNotes: number[];
  prevActiveNotes: number[];
  setPrevActiveNotes: (prevActiveNotes: number[] | ((prev: number[]) => number[])) => void;
};

const HexGrid = ({ activeNotes, prevActiveNotes, setPrevActiveNotes }: Props) => {
  console.log('activeNotes:', activeNotes);
  const svgRef: React.RefObject<HTMLDivElement> = useRef(null);
  const gridRef: any = useRef(); // Use useRef to persist grid across re-renders
  const drawRef: any = useRef(); // Use useRef to persist draw across re-renders

  // Draw the SVG
  function renderSVG(hex: Hex) {
    const midiNote = hexToMidiNote(hex);
    const noteName = midiToNote[Number(midiNote)];
    // Create a polygon from a hex's corner points and add it to the existing SVG canvas
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _hexPolygon = drawRef.current
      .polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
      .fill(HEX_FILL_COLOR)
      .stroke({ width: 3, color: HEX_STROKE_COLOR })
      .data('row', hex.row) // Add data-row attribute
      .data('col', hex.col); // Add data-col attribute

    // Add text to display the index
    const center = hexToPoint(hex);
    drawRef.current
      .text(`${noteName}`)
      .move(center.x, center.y - 8)
      .font({ anchor: 'middle', size: 14, fill: TEXT_FILL_COLOR })
      .stroke({ color: HEX_STROKE_COLOR });
  }

  useEffect(() => {
    if (svgRef.current) {
      // Create the SVG canvas once
      drawRef.current = SVG().addTo(svgRef.current).size('100%', '100%');

      // Define the hex with the origin set to 'topLeft' for rendering purposes
      const Hex = defineHex({ dimensions: 50, origin: { x: -100, y: -100 } });
      gridRef.current = new Grid(Hex, rectangle({ width: 9, height: 9 }));

      gridRef.current.forEach(renderSVG);
    }
  }, []);

  // Runs on every render
  useEffect(() => {
    // Update hexagons corresponding to currently active notes
    activeNotes.forEach((note: number) => {
      const hexes = MidiNoteToHex(note);
      // If note is out of bounds, do nothing
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
        // If note is out of bounds, do nothing
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

  return (
    <div
      id="hex-grid"
      ref={svgRef}
      // TODO: styles move these to css files to make responsive
      style={{
        width: '1300px',
        height: '1200px',
        margin: '0 auto',
      }}
    />
  );
};

export default React.memo(HexGrid);
