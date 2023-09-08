import React, { useEffect, useRef } from 'react';
import { defineHex, Grid, rectangle, hexToPoint } from 'honeycomb-grid';
import { SVG } from '@svgdotjs/svg.js';
import midiToNote from './midiToNote.js';
import { midiToHex, hexToMidiNote } from './midiToHex';

const HexGrid = (props) => {
    const svgRef = useRef(null);
    const gridRef = useRef(); // Use useRef to persist grid across re-renders
    const drawRef = useRef(); // Use useRef to persist draw across re-renders
    function renderSVG(hex) {
        // Create a polygon from a hex's corner points and add it to the existing SVG canvas
        const hexPolygon = drawRef.current.polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
        .fill('none')
        .stroke({ width: 1, color: '#555' })
            .data('row', hex.row) // Add data-row attribute
            .data('col', hex.col); // Add data-col attribute

        // Add text to display the index
            const center = hexToPoint(hex);
            drawRef.current.text(`${hex.row},${hex.col}`)
            .move(center.x, center.y)
            .font({ anchor: 'middle', size: 12, fill: '#000' });
    }

    useEffect(() => {
        console.log("useEffect is running");

        // Create the SVG canvas once
        drawRef.current = SVG().addTo(svgRef.current).size('100%', '100%');


        // Define the hex with the origin set to 'topLeft' for rendering purposes
            const Hex = defineHex({ dimensions: 30, origin: { x: -100, y: -100 } });
            gridRef.current = new Grid(Hex, rectangle({ width: 9, height: 9 }));

            gridRef.current.forEach(renderSVG);
        }, []);

    // Update fill color of hexagons when props.activeNotes changes
    useEffect(() => {
        console.log("useEffect for updating fill color is running");

        props.activeNotes.forEach(note => {


            const hex = midiToHex(note);
            const hexPolygon = drawRef.current.find(`polygon[data-row="${hex.row}"][data-col="${hex.col}"]`);
            console.log(`Hex [${hex.row}, ${hex.col}] -> Polygon:`, hexPolygon);

            if (hexPolygon) {
                hexPolygon.fill('blue');
            }
        });

    // Reset other hexagons to their default fill (optional)
    // ... 

    }, [props.activeNotes]);

    return <div ref={svgRef} style={{ width: '1300px', height: '1200px' }} />;
};

export default React.memo(HexGrid);
