// lates HexGrid.js
import React, { useEffect, useRef } from "react"
import { defineHex, Grid, rectangle, hexToPoint } from "honeycomb-grid"
import { SVG } from "@svgdotjs/svg.js"
import midiToNote from "./midiToNote.js"
import { hexToMidiNote } from "./midiToHex"

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
            .fill("none")
            .stroke({ width: 1, color: "#555" })
            .data("row", hex.row) // Add data-row attribute
            .data("col", hex.col) // Add data-col attribute

        // Add text to display the index
        const center = hexToPoint(hex)
        drawRef.current
            // .text(`${hex.col},${hex.row}`)
            .text(`${noteName}`)
            .move(center.x, center.y)
            .font({ anchor: "middle", size: 12, fill: "#000" })
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

    // Update fill color of hexagons when props.activeNotes changes
    // Update fill color of hexagons based on props.activeNotes
    useEffect(() => {
        gridRef.current.forEach((hex) => {
            const midiNote = hexToMidiNote(hex)
            const hexPolygon = drawRef.current.find(
                `polygon[data-row="${hex.row}"][data-col="${hex.col}"]`
            )

            if (hexPolygon && hexPolygon.length > 0) {
                if (props.activeNotes.includes(midiNote)) {
                    hexPolygon.fill("#b3e87d")
                } else {
                    hexPolygon.fill("none") // or 'white' if you want them to be white
                }
            }
        })
    }, [props.activeNotes])

    return <div ref={svgRef} style={{ width: "1300px", height: "1200px" }} />
}

export default React.memo(HexGrid)
