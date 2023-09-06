// current working code, please update your context
import React, { useEffect, useRef } from 'react';
import { defineHex, Grid, rectangle,hexToPoint } from 'honeycomb-grid'
import { SVG } from '@svgdotjs/svg.js'
import  midiToNote  from './midiToNote.js'
import  midiToHex  from './midiToHex.js'

const HexGrid = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        console.log("useEffect is running");

        const midiNotes = [60, 64, 67];  // C4, E4, G4
        console.log(midiToHex(midiNotes));


        // Create the SVG canvas once
        const draw = SVG().addTo(svgRef.current).size('100%', '100%');

        function renderSVG(hex) {
            // Create a polygon from a hex's corner points and add it to the existing SVG canvas
            draw.polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
            .fill('none')
            .stroke({ width: 1, color: '#555' });
            // Add text to display the index
            const center = hexToPoint(hex);
            draw.text(`${hex.row},${hex.col}`)

            .move(center.x, center.y)
            .font({ anchor: 'middle', size: 12, fill: '#000' });


        }

        // Define the hex with the origin set to 'topLeft' for rendering purposes
        const Hex = defineHex({ dimensions: 30,   origin: { x: -100, y: -100 }, // the center of the hex
    });
        const grid = new Grid(Hex, rectangle({ width: 9, height: 9 }));

        grid.forEach(renderSVG);
    }, []);

    return <div ref={svgRef} style={{ width: '1300px', height: '1200px' }} />;
};

export default React.memo(HexGrid);
