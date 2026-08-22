<script setup lang="ts">
import * as THREE from 'three'
import mapboxgl from 'mapbox-gl'

type LngLat = [number, number]

type CustomLayer = {
  id: string
  type: 'custom'
  renderingMode: '3d'
  onAdd: (map: mapboxgl.Map, gl: WebGLRenderingContext | WebGL2RenderingContext) => void
  render: (gl: WebGLRenderingContext | WebGL2RenderingContext, matrix: number[]) => void
  onRemove: () => void
}

const layerId = 'vineyard-three-overlay'
let map: mapboxgl.Map | null = null
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.Camera | null = null
let marker: THREE.Group | null = null
let location: LngLat | null = null
let markerStartedAt = 0
let markerBaseScale = 1
let markerBaseZ = 0

function buildMarker() {
  const group = new THREE.Group()
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(18, 0.75, 10, 40),
    new THREE.MeshBasicMaterial({ color: '#f4e5b1', transparent: true, opacity: 0.72, depthTest: false, depthWrite: false })
  )
  ring.rotation.x = Math.PI / 2

  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.65, 22, 10),
    new THREE.MeshBasicMaterial({ color: '#e6d29a', transparent: true, opacity: 0.88, depthTest: false, depthWrite: false })
  )
  stem.position.z = 11

  const terminal = new THREE.Mesh(
    new THREE.OctahedronGeometry(3.5, 0),
    new THREE.MeshBasicMaterial({ color: '#c2a04a', transparent: true, opacity: 0.96, depthTest: false, depthWrite: false })
  )
  terminal.position.z = 23

  group.add(ring, stem, terminal)
  return group
}

function updateMarkerPosition() {
  if (!marker || !location) {
    if (marker) marker.visible = false
    return
  }

  const elevation = map?.queryTerrainElevation(location) ?? 0
  const coordinate = mapboxgl.MercatorCoordinate.fromLngLat(location, elevation + 1.5)
  marker.visible = true
  marker.position.set(coordinate.x, coordinate.y, coordinate.z)
  const scale = coordinate.meterInMercatorCoordinateUnits()
  const zoom = map?.getZoom() ?? 14.8
  const zoomCompensation = Math.min(1.3, Math.max(0.78, 2 ** ((14.8 - zoom) * 0.22)))
  markerBaseScale = scale * zoomCompensation
  markerBaseZ = coordinate.z
  marker.scale.set(markerBaseScale, -markerBaseScale, markerBaseScale)
}

const layer: CustomLayer = {
  id: layerId,
  type: 'custom',
  renderingMode: '3d',
  onAdd(_map, gl) {
    map = _map
    scene = new THREE.Scene()
    camera = new THREE.Camera()
    marker = buildMarker()
    scene.add(marker)
    updateMarkerPosition()
    renderer = new THREE.WebGLRenderer({ canvas: _map.getCanvas(), context: gl, antialias: true })
    renderer.autoClear = false
  },
  render(_gl, matrix) {
    if (!renderer || !scene || !camera) return
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix)
    if (marker && markerStartedAt) {
      const elapsed = performance.now() - markerStartedAt
      const progress = Math.min(1, elapsed / 360)
      const eased = 1 - (1 - progress) ** 3
      marker.scale.set(markerBaseScale * eased, -markerBaseScale * eased, markerBaseScale * eased)
      marker.position.z = markerBaseZ
      if (progress >= 1) markerStartedAt = 0
      else map?.triggerRepaint()
    }
    renderer.resetState()
    renderer.render(scene, camera)
  },
  onRemove() {
    if (marker) {
      marker.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(material)) material.forEach((item) => item.dispose())
        else material?.dispose()
      })
    }
    renderer?.dispose()
    map = null
    renderer = null
    scene = null
    camera = null
    marker = null
    location = null
    markerStartedAt = 0
    markerBaseScale = 1
    markerBaseZ = 0
  }
}

function attachToMap(nextMap: mapboxgl.Map) {
  if (!nextMap.getLayer(layerId)) nextMap.addLayer(layer as never)
}

function setVineyardLocation(nextLocation?: LngLat) {
  location = nextLocation ?? null
  markerStartedAt = location ? performance.now() : 0
  updateMarkerPosition()
  map?.triggerRepaint()
}

function detachFromMap() {
  if (map?.getLayer(layerId)) map.removeLayer(layerId)
}

defineExpose({ attachToMap, detachFromMap, setVineyardLocation })
</script>

<template>
  <span class="three-overlay" aria-hidden="true" />
</template>

<style scoped>
.three-overlay { display: none; }
</style>
