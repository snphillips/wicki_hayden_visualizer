// src/HexGrid.js

import React, { useEffect, useRef } from 'react';
import { defineHex, Grid, rectangle } from 'honeycomb-grid'

const HexGrid = () => {
    const svgRef = useRef(null);

    useEffect(() => {
const Tile = defineHex({ dimensions: 30 })

const grid = new Grid(Tile, rectangle({ width: 10, height: 10 }))

grid.forEach(console.log)

        const svg = svgRef.current;

        grid.forEach(hex => {});
    }, []);

    return <svg ref={svgRef} width="800" height="600" />;
};

export default HexGrid;
