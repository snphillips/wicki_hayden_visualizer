import React, { useEffect, useRef } from 'react';
import { defineHex, Grid, rectangle } from 'honeycomb-grid'
import { SVG } from '@svgdotjs/svg.js'

const HexGrid = () => {
    const svgRef = useRef(null);

    useEffect(() => {
            console.log("useEffect is running");

        // Create the SVG canvas once
        const draw = SVG().addTo(svgRef.current).size('100%', '100%');

        function renderSVG(hex) {
            // Create a polygon from a hex's corner points and add it to the existing SVG canvas
            draw.polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
                .fill('none')
                .stroke({ width: 1, color: '#555' });
        }

        // Define the hex with the origin set to 'topLeft' for rendering purposes
        const Hex = defineHex({ dimensions: 50, origin: 'topLeft' });
        const grid = new Grid(Hex, rectangle({ width: 5, height: 5 }));

        grid.forEach(renderSVG);
    }, []);

    return <div ref={svgRef} style={{ width: '800px', height: '600px' }} />;
};

export default React.memo(HexGrid);
