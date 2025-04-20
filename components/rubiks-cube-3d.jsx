"use client"
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Button } from "@/components/ui/button"

const CUBE_SIZE = 1
const GAP = 0.1

export default function RubiksCube3D() {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const cubesRef = useRef([])
  const [selectedLayer, setSelectedLayer] = useState(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x1a1a1a)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    cameraRef.current = camera
    camera.position.set(4, 4, 4)
    camera.lookAt(0, 0, 0)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    rendererRef.current = renderer
    renderer.setPixelRatio(window.devicePixelRatio)
    
    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement)
    controlsRef.current = controls
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Create cubes
    const createCube = (x, y, z) => {
      const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)
      const materials = [
        new THREE.MeshPhongMaterial({ color: 0xff0000 }), // Right - Red
        new THREE.MeshPhongMaterial({ color: 0xff8c00 }), // Left - Orange
        new THREE.MeshPhongMaterial({ color: 0xffffff }), // Top - White
        new THREE.MeshPhongMaterial({ color: 0xffff00 }), // Bottom - Yellow
        new THREE.MeshPhongMaterial({ color: 0x00ff00 }), // Front - Green
        new THREE.MeshPhongMaterial({ color: 0x0000ff }), // Back - Blue
      ]
      const cube = new THREE.Mesh(geometry, materials)
      cube.position.set(
        x * (CUBE_SIZE + GAP),
        y * (CUBE_SIZE + GAP),
        z * (CUBE_SIZE + GAP)
      )
      cube.userData = { x, y, z }
      return cube
    }

    // Create 3x3x3 cube
    const cubes = []
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const cube = createCube(x, y, z)
          scene.add(cube)
          cubes.push(cube)
        }
      }
    }
    cubesRef.current = cubes

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.position.set(10, 10, 10)
    scene.add(directionalLight)

    // Handle resize
    const handleResize = () => {
      const container = containerRef.current
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    // Initial setup
    containerRef.current.appendChild(renderer.domElement)
    handleResize()
    window.addEventListener('resize', handleResize)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  const rotateLayer = (axis, index, angle) => {
    const cubes = cubesRef.current
    const rotationMatrix = new THREE.Matrix4()
    
    // Select cubes in the layer
    const layerCubes = cubes.filter(cube => {
      const pos = cube.userData
      switch(axis) {
        case 'x': return Math.round(pos.x) === index
        case 'y': return Math.round(pos.y) === index
        case 'z': return Math.round(pos.z) === index
      }
    })

    // Set rotation axis
    switch(axis) {
      case 'x':
        rotationMatrix.makeRotationX(angle)
        break
      case 'y':
        rotationMatrix.makeRotationY(angle)
        break
      case 'z':
        rotationMatrix.makeRotationZ(angle)
        break
    }

    // Apply rotation
    layerCubes.forEach(cube => {
      cube.position.applyMatrix4(rotationMatrix)
      cube.rotation.setFromRotationMatrix(
        rotationMatrix.multiply(new THREE.Matrix4().makeRotationFromEuler(cube.rotation))
      )
    })
  }

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef} 
        className="w-full aspect-square rounded-lg overflow-hidden bg-background border"
        style={{ touchAction: 'none' }}
      />
      
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-center">X-axis</h3>
          {[-1, 0, 1].map((index) => (
            <div key={`x${index}`} className="grid grid-cols-2 gap-2">
              <Button 
                size="sm"
                variant="outline"
                className="border-muted text-foreground hover:bg-muted/10"
                onClick={() => rotateLayer('x', index, Math.PI / 2)}
              >
                Row {index} →
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="border-muted text-foreground hover:bg-muted/10"
                onClick={() => rotateLayer('x', index, -Math.PI / 2)}
              >
                Row {index} ←
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-center">Y-axis</h3>
          {[-1, 0, 1].map((index) => (
            <div key={`y${index}`} className="grid grid-cols-2 gap-2">
              <Button 
                size="sm"
                variant="outline"
                className="border-muted text-foreground hover:bg-muted/10"
                onClick={() => rotateLayer('y', index, Math.PI / 2)}
              >
                Col {index} ↑
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="border-muted text-foreground hover:bg-muted/10"
                onClick={() => rotateLayer('y', index, -Math.PI / 2)}
              >
                Col {index} ↓
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-center">Z-axis</h3>
          {[-1, 0, 1].map((index) => (
            <div key={`z${index}`} className="grid grid-cols-2 gap-2">
              <Button 
                size="sm"
                variant="outline"
                className="border-muted text-foreground hover:bg-muted/10"
                onClick={() => rotateLayer('z', index, Math.PI / 2)}
              >
                Face {index} ↻
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="border-muted text-foreground hover:bg-muted/10"
                onClick={() => rotateLayer('z', index, -Math.PI / 2)}
              >
                Face {index} ↺
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
