"use client"

import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { Box, OrbitControls } from "@react-three/drei"

function CubePiece({ position, colors }) {
  const mesh = useRef()

  return (
    <Box ref={mesh} args={[0.95, 0.95, 0.95]} position={position}>
      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial key={index} attach={`material-${index}`} color={colors[index] || "#333333"} />
      ))}
    </Box>
  )
}

function CubeModel() {
  // Create a 3x3x3 Rubik's Cube
  const pieces = []

  // Colors for each face: [right, left, top, bottom, front, back]
  const faceColors = {
    right: "#ff0000", // red
    left: "#ff8000", // orange
    top: "#ffffff", // white
    bottom: "#ffff00", // yellow
    front: "#00ff00", // green
    back: "#0000ff", // blue
  }

  // Generate all 27 pieces
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Skip the center piece
        if (x === 0 && y === 0 && z === 0) continue

        const colors = [
          x === 1 ? faceColors.right : undefined,
          x === -1 ? faceColors.left : undefined,
          y === 1 ? faceColors.top : undefined,
          y === -1 ? faceColors.bottom : undefined,
          z === 1 ? faceColors.front : undefined,
          z === -1 ? faceColors.back : undefined,
        ]

        pieces.push(<CubePiece key={`${x},${y},${z}`} position={[x, y, z]} colors={colors} />)
      }
    }
  }

  return <group>{pieces}</group>
}

export function Cube3D() {
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <CubeModel />
      <OrbitControls enablePan={false} />
    </Canvas>
  )
}

