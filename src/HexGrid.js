import React, { useEffect, useRef } from 'react';
import { defineHex, Grid, rectangle } from 'honeycomb-grid'
import { SVG } from '@svgdotjs/svg.js'

const HexGrid = () => {
    const svgRef = useRef(null);
    useEffect(() => {



        function renderSVG(hex: Hex) {
            const draw = SVG().addTo('body').size('100%', '100%')
            const polygon = draw
            // create a polygon from a hex's corner points
            .polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
            .fill('none')
            .stroke({ width: 1, color: '#999' })

            return draw.group().add(polygon)
        }


        // Define the hex with the origin set to 'topLeft' for rendering purposes
        const Hex = defineHex({ dimensions: 30, origin: 'topLeft' })
        const grid = new Grid(Hex, rectangle({ width: 1000, height: 1000 }))

        const svg = svgRef.current;

        grid.forEach(renderSVG);
    }, []);

    return <svg ref={svgRef} width="800" height="600" />;
};

export default HexGrid;
