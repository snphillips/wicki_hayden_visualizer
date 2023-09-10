import React, { useEffect, useRef } from "react"
import { defineHex, Grid, rectangle, hexToPoint } from "honeycomb-grid"
import { SVG } from "@svgdotjs/svg.js"
import midiToNote from "./midiToNote.js"
import { hexToMidiNote } from "./midiToHex"

// Color literals extracted to constants
const HEX_FILL_COLOR = '#f2f2f2';
const HEX_STROKE_COLOR = '#b3b3b3';
const HEX_ACTIVE_FILL_COLOR = '#b3e87d';
const TEXT_FILL_COLOR = '#000';

const HexGrid = (props) => {
    const svgRef = useRef(null)
    const gridRef = useRef() // Use useRef to persist grid across re-renders
    const drawRef = useRef() // Use useRef to persist draw across re-renders
    function renderSVG(hex) {
        const midiNote = hexToMidiNote(hex)
        const noteName = midiToNote[Number(midiNote)]
        // Create a polygon from a hex's corner points and add it to the existing SVG canvas
        const hexPolygon = drawRef.current
            .polygon(hex.corners.map(({ x, y }) => `${x},${y}`))
            .fill(HEX_FILL_COLOR)
            .stroke({ width: 3, color: HEX_STROKE_COLOR })
            .data("row", hex.row) // Add data-row attribute
            .data("col", hex.col) // Add data-col attribute

        // Add text to display the index
        const center = hexToPoint(hex)
        drawRef.current
            .text(`${noteName}`)
            .move(center.x, center.y-8)
            .font({ anchor: "middle", size: 14, fill: TEXT_FILL_COLOR })
            .stroke({ color: HEX_STROKE_COLOR })
    }

    useEffect(() => {
        console.log("useEffect is running")

        // Create the SVG canvas once
        drawRef.current = SVG().addTo(svgRef.current).size("100%", "100%")

        // Define the hex with the origin set to 'topLeft' for rendering purposes
        const Hex = defineHex({ dimensions: 50, origin: { x: -100, y: -100 } })
        gridRef.current = new Grid(Hex, rectangle({ width: 9, height: 9 }))

        gridRef.current.forEach(renderSVG)
    }, [])

    // Update fill color of hexagons based on props.activeNotes
    useEffect(() => {
        gridRef.current.forEach((hex) => {
            const midiNote = hexToMidiNote(hex)
            const hexPolygon = drawRef.current.find(
                `polygon[data-row="${hex.row}"][data-col="${hex.col}"]`
            )

            if (hexPolygon && hexPolygon.length > 0) {
                if (props.activeNotes.includes(midiNote)) {
                    hexPolygon.fill(HEX_ACTIVE_FILL_COLOR)
                } else {
                    hexPolygon.fill(HEX_FILL_COLOR)
                }
            }
        })
    }, [props.activeNotes])

    return <div ref={svgRef} style={{ width: "1300px", height: "1200px" ,margin: '0 auto'}} />
}

export default React.memo(HexGrid)
