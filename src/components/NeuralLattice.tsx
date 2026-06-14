import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const RADIUS = 3
const DETAIL = 2
const PARTICLE_COUNT = 50
const BASE_COLOR = 0x00B4D8
const CORE_GLOW = 0xFFFFFF

const glowVert = `
  attribute float opacity;
  varying float vOpacity;
  void main() {
    vOpacity = opacity;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 8.0 * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const glowFrag = `
  uniform vec3 color;
  uniform vec3 coreColor;
  varying float vOpacity;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    float strength = 1.0 - (dist * 2.0);
    if (strength > 0.0) {
      vec3 finalColor = mix(coreColor, color, strength);
      float alpha = strength * vOpacity;
      gl_FragColor = vec4(finalColor, alpha);
    } else {
      discard;
    }
  }
`

interface EdgeData {
  v1: THREE.Vector3
  v2: THREE.Vector3
  speed: number
  phase: number
  psys: THREE.Points
}

export default function NeuralLattice() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (cleanupRef.current) return

    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    const group = new THREE.Group()
    group.rotation.x = Math.PI / 3
    group.rotation.y = Math.PI / 6
    scene.add(group)

    const geo = new THREE.IcosahedronGeometry(RADIUS, DETAIL)
    const edgesGeo = new THREE.EdgesGeometry(geo)
    const wireMat = new THREE.LineBasicMaterial({ color: BASE_COLOR, transparent: true, opacity: 0.25 })
    const wireframe = new THREE.LineSegments(edgesGeo, wireMat)
    group.add(wireframe)

    const edgeMap: Map<string, { v1: THREE.Vector3; v2: THREE.Vector3; key1: string; key2: string }> = new Map()
    const rawEdges: { v1: THREE.Vector3; v2: THREE.Vector3; key1: string; key2: string; isDup?: boolean }[] = []
    const posArr = edgesGeo.attributes.position.array as Float32Array

    for (let i = 0; i < posArr.length; i += 6) {
      const v1 = new THREE.Vector3(posArr[i], posArr[i + 1], posArr[i + 2])
      const v2 = new THREE.Vector3(posArr[i + 3], posArr[i + 4], posArr[i + 5])
      const key1 = [[v1.x, v1.y, v1.z], [v2.x, v2.y, v2.z]].sort().join('|')
      const key2 = v1.toArray().join(',') + '|' + v2.toArray().join(',')
      edgeMap.set(key1, { v1, v2, key1, key2 })
      edgeMap.set(key2, { v1, v2, key1, key2 })
      rawEdges.push({ v1, v2, key1, key2 })
    }

    const seen = new Set<string>()
    const uniqueEdges: { v1: THREE.Vector3; v2: THREE.Vector3; key1: string }[] = []
    for (const edge of rawEdges) {
      if (!seen.has(edge.key1)) {
        seen.add(edge.key1)
        uniqueEdges.push({ v1: edge.v1, v2: edge.v2, key1: edge.key1 })
      } else {
        edge.isDup = true
      }
    }

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(BASE_COLOR) },
        coreColor: { value: new THREE.Color(CORE_GLOW) },
      },
      vertexShader: glowVert,
      fragmentShader: glowFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const allEdgeData: EdgeData[] = []

    for (const edge of uniqueEdges) {
      const positions = new Float32Array(PARTICLE_COUNT * 3)
      const opacities = new Float32Array(PARTICLE_COUNT)
      const offset = Math.random() * 3.0

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3] = 0
        positions[i * 3 + 1] = 0
        positions[i * 3 + 2] = 0
        opacities[i] = (Math.sin((i / PARTICLE_COUNT) * Math.PI * 2 + offset) + 1) * 0.5
      }

      const edgeParticles = new THREE.BufferGeometry()
      edgeParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      edgeParticles.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1))

      const psys = new THREE.Points(edgeParticles, mat)
      group.add(psys)

      allEdgeData.push({
        v1: edge.v1,
        v2: edge.v2,
        speed: (0.3 + Math.random() * 1.2) * (Math.random() > 0.5 ? 1 : -1),
        phase: Math.random() * Math.PI * 2,
        psys,
      })
    }

    let animId: number
    let isVisible = true

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (!isVisible) return

      const time = performance.now() * 0.001

      wireMat.opacity = 0.15 + Math.sin(time * 0.5) * 0.1

      group.rotation.y = (Math.PI / 6) + time * 0.05
      group.rotation.x = (Math.PI / 3) + Math.sin(time * 0.2) * 0.1

      for (const edge of allEdgeData) {
        const posAttr = edge.psys.geometry.attributes.position
        const opaAttr = edge.psys.geometry.attributes.opacity
        const positions = posAttr.array as Float32Array
        const opacities = opaAttr.array as Float32Array

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const t = (Math.sin(time * edge.speed + edge.phase + i * 0.1) + 1) / 2
          positions[i * 3] = edge.v1.x + (edge.v2.x - edge.v1.x) * t
          positions[i * 3 + 1] = edge.v1.y + (edge.v2.y - edge.v1.y) * t
          positions[i * 3 + 2] = edge.v1.z + (edge.v2.z - edge.v1.z) * t
          const fade = Math.abs(Math.sin(time * edge.speed + edge.phase + i * 0.5))
          opacities[i] = fade * fade
        }

        posAttr.needsUpdate = true
        opaAttr.needsUpdate = true
      }

      renderer.render(scene, camera)
    }

    animate()

    const handleVisibility = () => {
      isVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    cleanupRef.current = () => {
      cancelAnimationFrame(animId)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('resize', handleResize)
      for (const edge of allEdgeData) {
        edge.psys.geometry.dispose()
      }
      mat.dispose()
      wireMat.dispose()
      edgesGeo.dispose()
      geo.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
