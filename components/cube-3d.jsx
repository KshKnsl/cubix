"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
export function Cube3D() {
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
    </Canvas>
  )
}
